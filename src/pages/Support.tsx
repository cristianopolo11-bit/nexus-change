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
    
    const subject = encodeURIComponent(`Suporte Nexus Change - Mensagem de ${name}`);
    const body = encodeURIComponent(`Olá Nexus Change,\n\nNome: ${name}\n\nMensagem: ${message}`);
    
    window.location.href = `mailto:${emailNexus}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-amber-50 pb-20 font-sans text-slate-900 antialiased selection:bg-amber-300 selection:text-[#1a4571]">
      
      {/* HEADER CORPORATIVO UNIFICADO COM BOTÃO REGRESSAR */}
      <header className="bg-[#1a4571] py-16 px-6 text-center text-white border-b-4 border-amber-400 relative">
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full bg-white/10 hover:bg-amber-400 hover:text-[#1a4571] text-white border border-white/20 transition-all duration-300 hover:scale-110 shadow-lg"
            aria-label="Regressar à página inicial"
          >
            <ArrowLeft size={22} />
          </Button>
        </div>

        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
          Central de Atendimento
        </h1>
        <p className="text-blue-100 max-w-2xl mx-auto font-medium text-sm">
          Estamos disponíveis para apoiar e esclarecer qualquer questão operacional no âmbito global.
        </p>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUNA DO FORMULÁRIO (ESQUERDA) */}
          <Card className="lg:col-span-7 p-6 md:p-10 border-4 border-amber-400 shadow-[0_25px_60px_-15px_rgba(251,191,36,0.25)] bg-white rounded-[2.5rem] text-left">
            <div className="mb-6 space-y-2">
              <h2 className="text-3xl font-black text-[#1a4571] uppercase italic tracking-tighter">Envie-nos uma Mensagem</h2>
              <p className="text-slate-500 font-medium text-sm">Escreva a sua dúvida ou preocupação detalhadamente abaixo.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-amber-600 tracking-widest flex items-center gap-2">
                  <User size={14} /> Seu Nome Completo
                </label>
                <Input 
                  placeholder="Ex: João Manuel" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-14 border-2 border-amber-200 bg-amber-50/40 rounded-xl focus-visible:ring-4 focus-visible:ring-amber-200 focus-visible:border-amber-400 transition-all font-bold text-base placeholder:font-normal"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-amber-600 tracking-widest flex items-center gap-2">
                  <MessageCircle size={14} /> Sua Preocupação ou Informação
                </label>
                <Textarea 
                  placeholder="Descreva detalhadamente como podemos ajudar..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="min-h-[200px] border-2 border-amber-200 bg-amber-50/40 rounded-2xl p-4 focus:ring-4 focus:ring-amber-200 focus:border-amber-400 transition-all font-bold text-base placeholder:font-normal resize-none"
                />
              </div>

              <Button 
                type="submit"
                className="w-full h-16 bg-[#1a4571] hover:bg-[#0f2d4d] text-white font-black text-lg rounded-2xl transition-all duration-300 uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
              >
                PREPARAR E-MAIL <Send size={20} />
              </Button>
            </form>
          </Card>

          {/* COLUNA DE INFO (DIREITA) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            {/* Card de Email Direto */}
            <Card className="p-8 bg-[#1a4571] text-white rounded-[2.5rem] border-4 border-amber-400 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
              <Mail className="w-10 h-10 mb-4 text-amber-400" />
              <h3 className="text-xl font-black uppercase italic mb-2 tracking-tight">E-mail Direto</h3>
              <p className="text-amber-100/80 text-sm font-medium mb-4">Se preferir, escreva diretamente do seu cliente para:</p>
              <span className="text-sm font-mono font-bold bg-white/10 p-3.5 rounded-xl block truncate border border-white/10 shadow-inner">
                {emailNexus}
              </span>
            </Card>

            {/* Card de Horário */}
            <Card className="p-6 border-2 border-amber-200 bg-white shadow-lg rounded-[2rem]">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 rounded-xl border border-amber-200">
                  <Clock className="w-6 h-6 text-[#1a4571]" />
                </div>
                <div>
                  <h4 className="font-black text-[#1a4571] uppercase italic tracking-tight">Horário de Operação</h4>
                  <p className="text-sm text-slate-600 font-bold mt-1">Seg a Sáb: 08h - 22h</p>
                  <p className="text-sm text-slate-600 font-bold">Dom: 10h - 18h</p>
                </div>
              </div>
            </Card>

            {/* Banner de Segurança */}
            <div className="p-6 bg-amber-100/70 rounded-[2rem] border-2 border-amber-200 shadow-inner">
              <div className="flex items-center gap-2 mb-2 text-[#1a4571]">
                <ShieldCheck size={18} className="text-emerald-600" />
                <span className="text-xs font-black uppercase italic tracking-wider">Segurança Nexus</span>
              </div>
              <p className="text-[11px] text-slate-600 font-bold leading-relaxed uppercase">
                A Nexus Change nunca solicita senhas, códigos de validação ou credenciais bancárias privadas através de canais eletrónicos ou redes sociais.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Support;