import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Mail, 
  Clock, 
  ArrowLeft, 
  ShieldCheck,
  Send,
  User,
  MessageCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Support = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  
  const emailNexus = "nexuschangesuporte@gmail.com";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Codifica os componentes da URL para evitar erros com espaços ou símbolos
    const subject = encodeURIComponent(`Suporte Nexus Change - Mensagem de ${name}`);
    const body = encodeURIComponent(`Olá Nexus Change,\n\nNome: ${name}\n\nMensagem: ${message}`);
    
    // Abre o cliente de e-mail do usuário com os dados preenchidos
    window.location.href = `mailto:${emailNexus}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-in fade-in duration-500">
      <header className="p-6 flex items-center gap-4 bg-white border-b sticky top-0 z-50">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full">
          <ArrowLeft size={20} className="text-[#1a4571]" />
        </Button>
        <h1 className="text-xl font-black text-[#1a4571] uppercase italic tracking-tighter">Central de Atendimento</h1>
      </header>

      <div className="max-w-5xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUNA DO FORMULÁRIO (ESQUERDA) */}
          <Card className="lg:col-span-2 p-8 md:p-10 border-none shadow-2xl bg-white rounded-[2.5rem]">
            <div className="mb-8 space-y-2">
              <h2 className="text-3xl font-black text-[#1a4571] uppercase italic tracking-tighter">Envie-nos uma Mensagem</h2>
              <p className="text-slate-500 font-medium">Escreva a sua dúvida ou preocupação abaixo.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <User size={14} /> Seu Nome Completo
                </label>
                <Input 
                  placeholder="Ex: João Manuel" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-14 border-slate-100 bg-slate-50 rounded-xl focus:ring-2 focus:ring-[#1a4571]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <MessageCircle size={14} /> Sua Preocupação ou Informação
                </label>
                <Textarea 
                  placeholder="Descreva detalhadamente como podemos ajudar..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="min-h-[200px] border-slate-100 bg-slate-50 rounded-2xl p-4 focus:ring-2 focus:ring-[#1a4571] resize-none"
                />
              </div>

              <Button 
                type="submit"
                className="w-full h-16 bg-[#1a4571] hover:bg-black text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-blue-900/20 gap-3"
              >
                PREPARAR E-MAIL <Send size={20} />
              </Button>
            </form>
          </Card>

          {/* COLUNA DE INFO (DIREITA) */}
          <div className="space-y-6">
            <Card className="p-8 border-none shadow-xl bg-[#1a4571] text-white rounded-[2.5rem]">
              <Mail className="w-10 h-10 mb-6 text-blue-300" />
              <h3 className="text-xl font-black uppercase italic mb-2">E-mail Direto</h3>
              <p className="text-blue-100/80 text-sm font-medium mb-4">Se preferir, escreva diretamente para:</p>
              <span className="text-sm font-bold bg-white/10 p-3 rounded-lg block truncate">
                {emailNexus}
              </span>
            </Card>

            <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <Clock className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-black text-[#1a4571] uppercase italic">Horário de Operação</h4>
                  <p className="text-sm text-slate-500 font-medium">Seg a Sáb: 08h - 22h</p>
                  <p className="text-sm text-slate-500 font-medium">Dom: 10h - 18h</p>
                </div>
              </div>
            </Card>

            <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
              <div className="flex items-center gap-2 mb-3 text-[#1a4571]">
                <ShieldCheck size={18} className="text-blue-600" />
                <span className="text-xs font-black uppercase italic">Segurança Nexus</span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold leading-tight uppercase">
                A Nexus Change nunca solicita senhas ou dados bancários privados através de e-mail ou redes sociais.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Support;