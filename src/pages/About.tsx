import React from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Zap, Target, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-left relative">
      {/* HEADER CORPORATIVO UNIFICADO */}
      <header className="bg-[#1a4571] py-16 px-6 text-center text-white relative">
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
          Sobre a Nexus Change
        </h1>
        <p className="text-blue-100 max-w-2xl mx-auto font-medium text-sm">
          "Conectando valores, facilitando negócios e eliminando fronteiras digitais."
        </p>
      </header>

      <div className="max-w-4xl mx-auto px-6 -mt-10">
        {/* MANIFESTO PRINCIPAL COM ANIMAÇÃO */}
        <section 
          data-aos="fade-up"
          className="bg-white p-8 md:p-12 border-none shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-[2rem] space-y-4 mb-8"
        >
          <h2 className="text-2xl font-black text-[#1a4571] uppercase italic tracking-tight">Quem Somos</h2>
          <p className="text-slate-600 leading-relaxed font-medium text-sm md:text-base">
            A <strong>Nexus Change</strong> nasceu da necessidade de modernizar, desburocratizar e trazer transparência total ao mercado de intermediação cambial e pagamentos <strong>internacionais</strong>. Somos mais do que um simples simulador de taxas; atuamos como o elo tecnológico seguro entre as suas necessidades financeiras e as maiores plataformas do ecossistema financeiro internacional.
          </p>
          <p className="text-slate-600 leading-relaxed font-medium text-sm md:text-base">
            Através de uma infraestrutura digital robusta e de um atendimento humanizado de alto padrão, garantimos que qualquer indivíduo ou empresa possa operar globalmente com liquidez imediata, segurança regulada e total sigilo operacional.
          </p>
        </section>

        {/* COMPONENTES VERTICAIS DE PROPÓSITO */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Missão */}
          <div 
            data-aos="fade-up"
            className="flex gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-md transition-all duration-300 hover:translate-y-[-2px]"
          >
            <div className="bg-[#1a4571] p-3 rounded-xl h-fit text-white shadow-lg">
              <Target size={24} />
            </div>
            <div>
              <h3 className="font-black text-[#1a4571] uppercase italic text-sm mb-1">Nossa Missão</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Prover soluções tecnológicas simplificadas de câmbio e pagamentos, permitindo que qualquer utilizador tenha acesso a cotações in real-time e consiga transacionar com o exterior de forma descomplicada.
              </p>
            </div>
          </div>

          {/* Alcance/Estratégia Oculta */}
          <div 
            data-aos="fade-up"
            className="flex gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-md transition-all duration-300 hover:translate-y-[-2px]"
          >
            <div className="bg-[#1a4571] p-3 rounded-xl h-fit text-white shadow-lg">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="font-black text-[#1a4571] uppercase italic text-sm mb-1">Abrangência Digital</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Garantir que a ponte financeira chegue a quem precisa através da ferramenta mais acessível: o telemóvel. Operamos de forma descentralizada para cobrir as necessidades do mercado <strong>global</strong> com máxima flexibilidade.
              </p>
            </div>
          </div>

          {/* Diferencial/Tecnologia unificada */}
          <div 
            data-aos="fade-up"
            className="flex gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-md transition-all duration-300 hover:translate-y-[-2px]"
          >
            <div className="bg-[#1a4571] p-3 rounded-xl h-fit text-white shadow-lg">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="font-black text-[#1a4571] uppercase italic text-sm mb-1">Agilidade em Suporte Direto</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Unimos inovação ao toque humano. O nosso simulador prepara a sua intenção de operação, e o nosso sistema de chat privado integrado conecta-o instantaneamente a um operador dedicado para fechar o negócio com total confiança.
              </p>
            </div>
          </div>

          {/* Segurança */}
          <div 
            data-aos="fade-up"
            className="flex gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-md transition-all duration-300 hover:translate-y-[-2px]"
          >
            <div className="bg-[#1a4571] p-3 rounded-xl h-fit text-white shadow-lg">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-black text-[#1a4571] uppercase italic text-sm mb-1">Compromisso e Seriedade</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Valorizamos o rigor institucional. Operamos sob uma política restrita de proteção e sigilo financeiro, aplicando spreads altamente competitivos e transparência matemática absoluta em cada liquidação.
              </p>
            </div>
          </div>

        </div>

        {/* RODAPÉ DO ABOUT COM ANIMAÇÃO */}
        <div data-aos="fade-up" className="mt-16 pt-8 border-t border-slate-200 text-center space-y-1">
          <p className="text-slate-500 text-sm font-black italic uppercase tracking-tight">
            Nexus Change — Soluções Inteligentes à Escala Global
          </p>
          <p className="text-slate-400 text-[10px] uppercase tracking-widest font-black">
            Plataforma de Atendimento 100% Digital e Segura
          </p>
        </div>

      </div>
    </div>
  );
};

export default About;