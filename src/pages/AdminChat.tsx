import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Send, User, MessageSquare, ShieldCheck, AlertCircle, RefreshCw, FileText, Download } from "lucide-react";

interface Message {
  id: string;
  room_id: string;
  sender: "cliente" | "operador";
  message: string;
  created_at: string;
}

const AdminChat = () => {
  const [rooms, setRooms] = useState<string[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchActiveRooms = async () => {
    setLoadingRooms(true);
    setDbError(null);
    
    const { data, error } = await supabase
      .from("chat_messages")
      .select("room_id")
      .order("created_at", { ascending: false });
    
    if (error) {
      setDbError(`Erro ao ler base de dados: ${error.message}`);
      setLoadingRooms(false);
      return;
    }

    if (data) {
      const uniqueRooms = Array.from(new Set(data.map(m => m.room_id)));
      setRooms(uniqueRooms);
    }
    setLoadingRooms(false);
  };

  useEffect(() => {
    fetchActiveRooms();
  }, []);

  useEffect(() => {
    const globalChannel = supabase
      .channel("global-admin-listener")
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          fetchActiveRooms();
          if (activeRoom && payload.new.room_id === activeRoom) {
            setMessages((prev) => {
              if (prev.some(m => m.id === payload.new.id)) return prev;
              return [...prev, payload.new as Message];
            });
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(globalChannel); };
  }, [activeRoom]);

  useEffect(() => {
    if (!activeRoom) return;

    const loadRoomHistory = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("room_id", activeRoom)
        .order("created_at", { ascending: true });
      
      if (data) setMessages(data as Message[]);
    };

    loadRoomHistory();
  }, [activeRoom]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !activeRoom) return;

    const textToSend = reply;
    setReply("");

    const { error } = await supabase
      .from("chat_messages")
      .insert({
        room_id: activeRoom,
        sender: "operador",
        message: textToSend
      });

    if (error) {
      alert(`Mensagem não enviada: ${error.message}`);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-left text-slate-800">
      <div className="w-80 bg-white border-r flex flex-col shadow-xs">
        <div className="p-4 bg-[#1a4571] text-white flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-blue-300" />
            <span className="font-black uppercase text-xs tracking-wider">Mesa de Operações</span>
          </div>
          <button onClick={fetchActiveRooms} className="p-1.5 hover:bg-white/10 rounded-lg text-white">
            <RefreshCw size={14} className={loadingRooms ? "animate-spin" : ""} />
          </button>
        </div>

        {dbError && (
          <div className="m-3 p-3 bg-red-50 text-red-700 rounded-xl flex items-start gap-2 text-xs font-semibold">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p>{dbError}</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {rooms.length === 0 ? (
            <div className="text-center text-slate-400 text-xs font-medium py-8 px-4">
              {loadingRooms ? "A ligar ao Supabase..." : "Nenhuma negociação aberta no momento."}
            </div>
          ) : (
            rooms.map(room => {
              const formattedName = room.replace(/_/g, " ");
              const isSelected = activeRoom === room;
              return (
                <button 
                  key={room}
                  onClick={() => setActiveRoom(room)}
                  className={`w-full p-3.5 text-left rounded-xl flex flex-col gap-1 transition-all ${
                    isSelected ? 'bg-[#1a4571]/10 text-[#1a4571] font-bold border-l-4 border-[#1a4571]' : 'text-slate-600 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs">
                    <User size={14} className={isSelected ? "text-[#1a4571]" : "text-slate-400"} />
                    <span className="truncate max-w-[200px] font-bold">{formattedName.split(" (")[0]}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-slate-50">
        {activeRoom ? (
          <>
            <div className="p-4 bg-white border-b shadow-xs flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">A responder a</span>
              <h2 className="font-black text-sm text-slate-700 truncate">{activeRoom.replace(/_/g, " ")}</h2>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map(msg => {
                const isOp = msg.sender === "operador";
                // Limpa tags de contexto se existirem
                let rawMessage = msg.message.includes("]") ? msg.message.substring(msg.message.indexOf("]") + 1).trim() : msg.message;
                
                // Detetar se a mensagem é um ficheiro/comprovativo em Base64
                const isFile = rawMessage.startsWith("data:image/") || rawMessage.startsWith("[FICHEIRO]");
                if (rawMessage.startsWith("[FICHEIRO]")) {
                  rawMessage = rawMessage.replace("[FICHEIRO]", "");
                }

                return (
                  <div key={msg.id} className={`flex ${isOp ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[65%] p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-2xs ${
                      isOp ? "bg-emerald-600 text-white rounded-tr-none" : "bg-white text-slate-700 border border-slate-200 rounded-tl-none"
                    }`}>
                      {isFile ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 bg-slate-100 text-slate-700 p-2.5 rounded-xl border">
                            <FileText size={20} className="text-blue-600 shrink-0" />
                            <div className="flex-1 truncate">
                              <span className="block font-bold text-[11px]">Comprovativo de Transferência</span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase">Imagem Anexada</span>
                            </div>
                          </div>
                          <a 
                            href={rawMessage} 
                            download="comprovativo-nexus.png"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-1.5 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                          >
                            <Download size={12} /> Ver / Descarregar Ficheiro
                          </a>
                        </div>
                      ) : (
                        <p>{rawMessage}</p>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendReply} className="p-4 bg-white border-t flex gap-2 items-center shadow-md">
              <input 
                type="text" 
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Escreva a resposta e pressione Enter..." 
                className="flex-1 h-12 border border-slate-200 rounded-xl px-4 text-xs font-medium focus:outline-none focus:border-[#1a4571] text-slate-700 bg-slate-50"
              />
              <button type="submit" className="h-12 w-12 bg-[#1a4571] text-white flex items-center justify-center rounded-xl hover:bg-black transition-colors shrink-0">
                <Send size={14} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
            <div className="p-4 bg-white rounded-full shadow-xs text-slate-300">
              <MessageSquare size={44} className="stroke-1" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Selecione uma negociação para responder</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;