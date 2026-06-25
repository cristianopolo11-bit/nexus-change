import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const FAQ = () => {
  const navigate = useNavigate();
  // Estado que guarda o índice da pergunta aberta (ou null se estiverem todas fechadas)
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    // Se clicar na que já está aberta, fecha (null). Se não, abre a nova (index).
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Como funciona a simulação e o fecho da operação?",
      answer: "O nosso simulador na página inicial dá-te uma cotação estimada em tempo real com base nas taxas de mercado globais atuais. Para fechar o negócio, basta clicares nos botões de compra ou venda. O nosso canal de atendimento abre instantaneamente, conectando-te a um operador em serviço que validará os dados e guiará a liquidação."
    },
    {
      question: "Quais são os métodos de pagamento aceites?",
      answer: "Para processarmos a tua transação, aceitamos transferências bancárias locais via identificação bancária padrão ou métodos de pagamento imediatos integrados na tua região. Assim que o comprovativo for validado pelo operador no chat, o teu saldo internacional é enviado."
    },
    {
      question: "Quanto tempo demora o processamento dos ativos?",
      answer: "Operações digitais comuns (como envio de USDT, USDC ou recarga de cartões digitais globais) são quase instantâneas, demorando entre 5 a 15 minutos após a confirmação do pagamento local. Transferências bancárias internacionais dependem dos prazos dos bancos correspondentes, mas são iniciadas imediatamente pelo operador."
    },
    {
      question: "Preciso de ter uma conta bancária internacional própria para usar a plataforma?",
      answer: "Não! Esse é o nosso maior diferencial. Se queres efetuar uma compra online, pagar uma subscrição ou carregar uma carteira digital e apenas tens acesso aos teus métodos de pagamento locais, nós fazemos o pagamento por ti a partir das nossas contas internacionais associadas. Tu liquidas localmente e nós resolvemos o resto globalmente."
    },
    {
      question: "A plataforma cobra alguma taxa oculta?",
      answer: "Nenhuma. O valor que vês no resultado da simulação ou que é acordado expressamente com o operador no chat é o valor final que vais pagar. O nosso spread comercial já está incluído na cotação exibida, garantindo total transparência matemática."
    },
    {
      question: "Como funcionam os futuros Agentes Físicos?",
      answer: "Estamos a expandir a nossa infraestrutura tecnológica. Em breve, anunciaremos pontos de atendimento físicos em lojas parceiras estrategicamente localizadas em várias regiões. Isso permitirá que clientes façam trocas, tirem dúvidas ou entreguem valores presencialmente com total segurança corporativa."
    }
  ];

  const handleAbrirSuporteGeral = () => {
    if (typeof window !== "undefined" && (window as any).Tawk_API) {
      const tawk = (window as any).Tawk_API;
      tawk.showWidget();
      tawk.maximize();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-left relative">
      
      {/* HEADER CORPORATIVO UNIFICADO COM BOTÃO REGRESSAR */}
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
          Perguntas Frequentes (FAQ)
        </h1>
        <p className="text-blue-100 max-w-2xl mx-auto font-medium text-sm">
          Esclareça as suas dúvidas instantaneamente sobre o funcionamento da Nexus Change.
        </p>
      </header>

      <div className="max-w-3xl mx-auto px-6 -mt-10">
        {/* LISTA DE PERGUNTAS */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              data-aos="fade-up"
              className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 flex items-center justify-between gap-4 font-black text-[#1a4571] text-sm md:text-base text-left hover:bg-slate-50/50 transition-colors focus:outline-none"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle size={20} className="text-blue-500 shrink-0" />
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp size={20} className="text-[#1a4571] shrink-0" />
                ) : (
                  <ChevronDown size={20} className="text-slate-400 shrink-0" />
                )}
              </button>

              {/* Bloco de Resposta Ativo de forma limpa */}
              {openIndex === index && (
                <div className="px-6 pb-6 pt-2 text-slate-600 font-medium text-xs md:text-sm leading-relaxed border-t border-slate-50 bg-slate-50/30 transition-all duration-300 text-left">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CASO AINDA TENHA DÚVIDAS */}
        <div 
          data-aos="fade-up"
          className="mt-12 bg-white border border-slate-100 shadow-xl p-8 rounded-[2rem] text-center space-y-4"
        >
          <h3 className="text-xl font-black text-[#1a4571] uppercase italic">Ainda tens alguma dúvida?</h3>
          <p className="text-slate-500 font-medium text-xs md:text-sm max-w-lg mx-auto">
            Se a tua dúvida não está listada acima, não te preocupes. O nosso suporte humano está online e pronto para te ajudar agora mesmo.
          </p>
          <button 
            onClick={handleAbrirSuporteGeral}
            className="inline-flex items-center gap-2 bg-[#1a4571] hover:bg-black text-white font-black text-xs uppercase tracking-wider px-6 h-12 rounded-xl transition-all shadow-md"
          >
            FALAR COM UM OPERADOR <MessageSquare size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default FAQ;