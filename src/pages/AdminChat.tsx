import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Users, MessageSquare, Send, CheckCircle2, ShieldAlert } from "lucide-react";

interface Room {
  id: string;
  client_name: string;
  status: string;
  created_at: string;
}

interface Message {
  id: string;
  sender: "cliente" | "operador";
  message: string;
  created_at: string;
}

export default function AdminChat() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeRoom = rooms.find((r) => r.id === selectedRoomId);

  // Scroll automático para a última mensagem da conversa ativa
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 1. Escutar Novas Salas de Clientes em Tempo Real
  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await supabase
        .from("chat_rooms")
        .select("*")
        .eq("status", "aberto")
        .order("created_at", { ascending: false });
      if (data) setRooms(data as Room[]);
    };

    fetchRooms();

    const roomChannel = supabase
      .channel("admin-rooms")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_rooms" }, (payload) => {
        setRooms((prev) => [payload.new as Room, ...prev]);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "chat_rooms" }, (payload) => {
        const updated = payload.new as Room;
        if (updated.status === "fechado") {
          setRooms((prev) => prev.filter((r) => r.id !== updated.id));
          setSelectedRoomId((curr) => (curr === updated.id ? null : curr));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(roomChannel); };
  }, []);

  // 2. Escutar Mensagens da Sala Ativa em Tempo Real
  useEffect(() => {
    if (!selectedRoomId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("room_id", selectedRoomId)
        .order("created_at", { ascending: true });
      if (data) setMessages(data as Message[]);
    };

    fetchMessages();

    const msgChannel = supabase
      .channel(`admin-room-${selectedRoomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `room_id=eq.${selectedRoomId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(msgChannel); };
  }, [selectedRoomId]);

  // 3. Enviar Resposta como Operador
  const handleSendResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoomId) return;

    const text = newMessage;
    setNewMessage("");

    await supabase.from("chat_messages").insert({
      room_id: selectedRoomId,
      sender: "operador",
      message: text,
    });
  };

  // 4. Terminar e Fechar Chamado do Cliente
  const handleCloseRoom = async (id: string) => {
    await supabase.from("chat_rooms").update({ status: "fechado" }).eq("id", id);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-left">
      {/* Barra Lateral: Lista de Clientes Ativos */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-xs">
        <div className="p-5 bg-[#1a4571] text-white flex items-center gap-2">
          <Users size={20} />
          <h2 className="font-black uppercase tracking-wider text-xs italic">Operadores Nexus</h2>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {rooms.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium text-xs space-y-2">
              <ShieldAlert size={28} className="mx-auto text-slate-300" />
              <p>Nenhum cliente em espera...</p>
            </div>
          ) : (
            rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                  selectedRoomId === room.id ? "bg-blue-50/70 border-r-4 border-r-[#1a4571]" : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-bold text-sm text-[#1a4571]">
                    {room.client_name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm max-w-[180px] truncate">{room.client_name}</p>
                    <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black rounded-sm text-[8px] uppercase tracking-wide">
                      Em Espera
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Janela Central: Chat com o Cliente Selecionado */}
      <div className="flex-1 flex flex-col bg-slate-100">
        {activeRoom ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-white max-w-4xl w-full mx-auto my-6 rounded-[2rem] shadow-xl border border-slate-200/50">
            {/* Topo do Chat */}
            <div className="p-4 bg-slate-50 border-b flex justify-between items-center px-6">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Negociação Ativa</p>
                <h3 className="font-black text-slate-800 text-base">{activeRoom.client_name}</h3>
              </div>
              <button
                onClick={() => handleCloseRoom(activeRoom.id)}
                className="h-10 px-4 bg-emerald-500 hover:bg-black text-white font-black text-xs uppercase tracking-widest rounded-xl transition-colors flex items-center gap-2 shadow-xs"
              >
                <CheckCircle2 size={14} /> Fechar Chamado
              </button>
            </div>

            {/* Balões de Mensagens */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "operador" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-xs ${
                      msg.sender === "operador"
                        ? "bg-[#1a4571] text-white rounded-tr-none"
                        : "bg-white text-slate-700 border border-slate-200 rounded-tl-none"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Campo de Envio de Mensagem */}
            <form onSubmit={handleSendResponse} className="p-4 bg-white border-t flex gap-3 px-6">
              <input
                type="text"
                placeholder="Escreva a resposta para o cliente..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#1a4571] text-slate-700"
              />
              <button
                type="submit"
                className="w-12 h-12 bg-[#1a4571] hover:bg-black text-white flex items-center justify-center rounded-xl transition-all shadow-xs"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        ) : (
          /* Estado Vazio (Sem salas selecionadas) */
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md text-slate-400">
              <MessageSquare size={28} />
            </div>
            <h4 className="font-black uppercase text-slate-400 tracking-widest text-[10px]">Mesa de Atendimento</h4>
            <p className="text-slate-500 font-bold text-sm">Selecione uma negociação na barra lateral para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
}