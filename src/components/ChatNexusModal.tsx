import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { X, Send, Lock } from "lucide-react";

interface Message {
  id: string;
  sender: "cliente" | "operador";
  message: string;
  created_at: string;
}

interface ChatNexusModalProps {
  isOpen: boolean;
  onClose: () => void;
  contexto: string; // Ex: "Comprar USD", "Vender EUR", "Atualização de Cartão"
}

export const ChatNexusModal = ({ isOpen, onClose, contexto }: ChatNexusModalProps) => {
  const [step, setStep] = useState<"nome" | "chat">("nome");
  const [clientName, setClientName] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Escutar mensagens em tempo real da sala privada
  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `room_id=eq.${roomId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [roomId]);

  if (!isOpen) return null;

  // 1. Criar a sessão privada do cliente (MÉTODO ULTRA-ROBUSTO)
  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    // Geramos o ID diretamente no React para não depender do retorno da query
    const novoRoomId = crypto.randomUUID();
    const nomeCompletoComContexto = `${clientName} (${contexto})`;

    const { error } = await supabase
      .from("chat_rooms")
      .insert({ 
        id: novoRoomId,
        client_name: nomeCompletoComContexto, 
        status: "aberto" 
      });

    if (error) {
      console.error("Erro crítico ao criar sala no Supabase:", error);
      alert("Erro de ligação ao banco de dados. Verifica o teu ficheiro .env");
      return;
    }

    // Altera o estado na hora usando o ID que criámos!
    setRoomId(novoRoomId);
    setStep("chat");
  };

  // 2. Enviar mensagem
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !roomId) return;

    const text = newMessage;
    setNewMessage("");

    await supabase.from("chat_messages").insert({
      room_id: roomId,
      sender: "cliente",
      message: text,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans text-left">
      <div className="w-full max-w-lg h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Cabeçalho */}
        <div className="bg-[#1a4571] p-5 text-white flex justify-between items-center">
          <div>
            <span className="font-black italic uppercase text-xs tracking-wider block">Mesa de Operação Privada</span>
            <span className="text-[10px] text-blue-200 uppercase font-bold">Serviço: {contexto}</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Formulário do Nome */}
        {step === "nome" ? (
          <form onSubmit={handleStartChat} className="flex-1 p-8 flex flex-col justify-center gap-4 bg-slate-50">
            <div className="text-center space-y-2">
              <p className="font-bold text-slate-800 text-lg">Para iniciar a operação de {contexto}</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">Insira o seu nome para abrir um canal de negociação privado e seguro.</p>
            </div>
            <input
              type="text"
              required
              placeholder="O seu nome completo..."
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1a4571] font-medium text-slate-700 shadow-xs"
            />
            <button type="submit" className="w-full h-12 bg-[#1a4571] hover:bg-black text-white font-black text-xs uppercase tracking-widest rounded-xl transition-colors shadow-md">
              Abrir Negociação
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase mt-2">
              <Lock size={10} /> Conexão Criptografada ponta-a-ponta
            </div>
          </form>
        ) : (
          /* Janela de Mensagens Privadas */
          <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.length === 0 && (
                <p className="text-center text-[11px] text-slate-400 font-bold uppercase tracking-wider py-4">
                  Conectado! Aguarde o operador ou envie uma mensagem.
                </p>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "cliente" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                    msg.sender === "cliente"
                      ? "bg-[#1a4571] text-white rounded-tr-none shadow-xs"
                      : "bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-xs"
                  }`}>
                    {msg.message}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-2 items-center">
              <input
                type="text"
                placeholder="Digite os dados da conta ou proposta..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#1a4571] text-slate-700"
              />
              <button type="submit" className="w-12 h-12 bg-[#1a4571] hover:bg-black text-white flex items-center justify-center rounded-xl transition-colors">
                <Send size={14} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};