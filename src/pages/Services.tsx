import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  HandCoins, 
  Globe, 
  ShieldCheck, 
  ArrowRight,
  Store,
  Wallet,
  MessageSquare,
  Send,
  ArrowLeft
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Services = () => {
  const navigate = useNavigate();

  // ⚠️ ATENÇÃO: Substitui pelo teu número real com código do país
  const numeroWhatsapp = "244928669514";

  const services = [
    {
      title: "Compra de Divisas",
      description: "Adquira USD, EUR ou USDT com pagamento via transferência bancária ou carteira digital. Use o nosso simulador inteligente e receba na sua conta internacional.",
      icon: <ShoppingCart className="w-8 h-8 text-[#1a4571]" />,
      actionType: "route",
      path: "/buy",
      color: "hover:border-amber-400"
    },
    {
      title: "Venda de Divisas (Cash-out)",
      description: "Converta o seu saldo internacional em moeda local com as melhores taxas do mercado. Dinheiro direto na sua conta bancária através do simulador.",
      icon: <HandCoins className="w-8 h-8 text-[#1a4571]" />,
      actionType: "route",
      path: "/sell",
      color: "hover:border-amber-400"
    },
    {
      title: "Transferências Internacionais",
      description: "Envie e receba valores entre vários países de forma simples. Preencha os dados do ordenante, beneficiário e simule o câmbio antes de enviar.",
      icon: <Send className="w-8 h-8 text-[#1a4571]" />,
      actionType: "route",
      path: "/transfer",
      color: "hover:border-amber-400",
      isNew: true
    },
    {
      title: "Criação de Carteiras Digitais",
      description: "Abertura e verificação segura de contas globais (Wise, RedotPay, Bybit ou Binance). Ideal para quem quer começar a operar sem entraves.",
      icon: <Wallet className="w-8 h-8 text-amber-500" />,
      actionType: "chat",
      color: "hover:border-amber-500"
    },
    {
      title: "Pagamentos Internacionais",
      description: "Pagamos as suas faturas, subscrições de plataformas ou compras online em qualquer parte do mundo de forma ágil através do operator.",
      icon: <Globe className="w-8 h-8 text-[#1a4571]" />,
      actionType: "chat",
      color: "hover:border-amber-400"
    },
    {
      title: "Agentes Físicos",
      description: "Em breve: Pontos de troca e atendimento físicos em lojas parceiras estrategicamente localizadas em várias localidades.",
      icon: <Store className="w-8 h-8 text-[#1a4571]" />,
      actionType: "soon",
      path: "#",
      color: "hover:border-amber-400",
      isSoon: true
    }
  ];

  // ROTEAMENTO OU REDIRECIONAMENTO WHATSAPP
  const handleCardClick = (service: typeof services[0]) => {
    if (service.actionType === "route" && service.path) {
      navigate(service.path);
    } else if (service.actionType === "chat") {
      let mensagem = `Olá! Gostaria de obter suporte para o serviço de *${service.title}* na Nexus Change.`;
      
      if (service.title.includes("Carteiras")) {
        mensagem = `Olá! Preciso de ajuda para *criar e verificar uma Carteira Digital* (Wise, RedotPay ou Binance) através da Nexus Change.`;
      } else if (service.title.includes("Pagamentos")) {
        mensagem = `Olá! Gostaria de realizar um *Pagamento Internacional* (compra online ou fatura) com o operador da Nexus Change.`;
      }

      const urlWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;
      window.open(urlWhatsapp, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 pb-20 text-left relative">
      
      {/* CABEÇALHO COM BOTÃO REGRESSAR INTEGRADO */}
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
          Nossos Serviços
        </h1>
        <p className="text-amber-100 max-w-2xl mx-auto font-medium text-sm">
          Soluções financeiras inteligentes para conectar o mercado local ao global com simulação ágil e atendimento humanizado.
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index}
              onClick={() => service.actionType !== "soon" && handleCardClick(service)}
              data-aos="fade-up"
              className={`p-8 bg-white border-2 border-amber-200 transition-all duration-300 shadow-lg rounded-2xl flex flex-col justify-between hover:shadow-xl hover:scale-[1.02] ${
                service.actionType === "soon" ? "opacity-75 cursor-not-allowed" : "cursor-pointer " + service.color
              }`}
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="mb-6 p-4 bg-amber-50 w-fit rounded-xl border-2 border-amber-200 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-black text-[#1a4571] uppercase italic mb-3 flex items-center flex-wrap gap-2">
                    {service.title}
                    {service.isNew && (
                      <span className="text-[10px] bg-amber-400 text-[#1a4571] font-black uppercase tracking-widest px-3 py-1 rounded-full not-italic shadow-sm">Novo</span>
                    )}
                    {service.isSoon && (
                      <span className="text-[10px] bg-amber-400 text-[#1a4571] font-black uppercase tracking-widest px-3 py-1 rounded-full not-italic shadow-sm">Em breve</span>
                    )}
                  </h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
                
                {service.actionType === "route" && (
                  <div className="mt-8 flex items-center text-[#1a4571] font-black text-xs uppercase tracking-wider gap-2 group-hover:gap-4 transition-all">
                    ACESSAR FORMULÁRIO <ArrowRight size={16} />
                  </div>
                )}

                {service.actionType === "chat" && (
                  <div className="mt-8 flex items-center text-emerald-600 font-black text-xs uppercase tracking-wider gap-2 group-hover:gap-4 transition-all">
                    SOLICITAR VIA WHATSAPP <MessageSquare size={16} />
                  </div>
                )}
                
                {service.actionType === "soon" && (
                  <div className="mt-8 flex items-center text-slate-400 font-black text-xs uppercase tracking-wider gap-2">
                    INDISPONÍVEL DE MOMENTO
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Banner inferior */}
        <div data-aos="fade-up" className="mt-16 bg-[#1a4571] rounded-[2.5rem] p-10 text-white text-center border-4 border-amber-400 shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="text-amber-400" />
              <span className="font-bold uppercase tracking-widest text-sm text-amber-200">Garantia Nexus</span>
            </div>
            <h2 className="text-3xl font-black italic uppercase">Pronto para transacionar?</h2>
            <p className="text-amber-100 font-medium max-w-xl mx-auto text-sm">
              A nossa equipa está disponível para processar as suas operações com total segurança, rapidez e sigilo absoluto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;