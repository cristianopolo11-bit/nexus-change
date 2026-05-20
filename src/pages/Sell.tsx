import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CurrencySelect from "@/components/CurrencySelect";
import ConversionResult from "@/components/ConversionResult";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { convert, getExchangeRate } from "@/lib/currencies";
import { ArrowLeft, MessageSquare, HandCoins, ShieldCheck } from "lucide-react";

const Sell = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(100);
  const [result, setResult] = useState<number>(0);
  const [currentRate, setCurrentRate] = useState<number>(0);
  const [fromCurr, setFromCurr] = useState("USD");
  const [toCurr, setToCurr] = useState("AOA");
  
  // NOVA GALERIA DE FOTOS (Exclusiva para a página de Venda)
  const sellImages = [
    // 1. Executivo alegre e confiante num escritório moderno (Cenário diferente da Home)
    "https://images.unsplash.com/photo-1519085114785-22b64d00874c?q=80&w=800&auto=format&fit=crop",
    // 2. Casal jovem e feliz celebrando conquistas financeiras no tablet (Diferente da família com crianças)
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
    // 3. Profissional de finanças sorrindo numa reunião corporativa descontraída
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
  ];
  const [imgIndex, setImgIndex] = useState(0);

  // Sistema de rotação robusto com preloading nativo contra ecrãs cinzentos
  useEffect(() => {
    const timer = setInterval(() => {
      // Calcula o próximo índice
      const nextIndex = (imgIndex + 1) % sellImages.length;
      
      // Cria um objeto de imagem em memória para forçar o download
      const imgCache = new Image();
      imgCache.src = sellImages[nextIndex];
      
      // Só troca o índice visual quando o browser confirmar que o download terminou
      imgCache.onload = () => {
        setImgIndex(nextIndex);
      };
    }, 4500); // Troca a cada 4.5 segundos
    return () => clearInterval(timer);
  }, [imgIndex, sellImages.length]);

  // CONTROLE CRÍTICO: Garante que o balão verde do Tawk.to fique invisível ao entrar na página
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Tawk_API) {
      try {
        (window as any).Tawk_API.hideWidget();
      } catch (e) {
        console.error("Erro ao esconder widget de venda:", e);
      }
    }
  }, []);

  // Lógica de cálculo sincronizada com as Taxas de VENDA (sellRates)
  useEffect(() => {
    const updateResult = async () => {
      try {
        // Passamos 'true' explicitamente para ativar a tabela de venda
        const rateValue = await convert(1, fromCurr, toCurr, true);
        
        // Fallback de segurança usando a tabela de venda
        const finalRate = rateValue && rateValue > 0 
          ? rateValue 
          : getExchangeRate(fromCurr, toCurr, true);
        
        setCurrentRate(finalRate);
        setResult(amount * finalRate);
      } catch (error) {
        console.error("Erro na conversão de venda:", error);
        const fallback = getExchangeRate(fromCurr, toCurr, true);
        setCurrentRate(fallback);
        setResult(amount * fallback);
      }
    };
    updateResult();
  }, [amount, fromCurr, toCurr]);

  // FUNÇÃO DO BOTÃO: Abre o chat às claras e despacha os metadados da venda ao operador
  const handleNegociarVenda = (e: React.MouseEvent) => {
    e.preventDefault();

    const mensagemFinal = `Olá Nexus Change! Realizei uma simulação de VENDA (Cash-out) no site.\n\n` +
                          `• Moeda que possuo: ${fromCurr}\n` +
                          `• Quantidade a Entregar: ${amount} ${fromCurr}\n` +
                          `• Total a Receber in Angola: ${result.toLocaleString('pt-PT')} AOA\n` +
                          `• Cotação de Garantia: ${currentRate} AOA\n\n` +
                          `Pretendo avançar com o Cash-out e coordenar as contas com o operador.`;

    if (typeof window !== "undefined" && (window as any).Tawk_API) {
      const tawk = (window as any).Tawk_API;
      
      // Força a exibição e maximização do chat
      tawk.showWidget();
      tawk.maximize();
      
      // Conecta os atributos organizados na consola do seu operador
      if (tawk.setAttributes) {
        tawk.setAttributes({
          'Simulacao-Tipo': 'VENDA_CASHOUT',
          'Simulacao-Moeda': fromCurr,
          'Simulacao-Montante': `${amount} ${fromCurr}`,
          'Simulacao-Retorno-Kz': `${result.toLocaleString('pt-PT')} AOA`
        });
      }
    } else {
      // Alternativa via e-mail corporativo em caso de falha de scripts de rede
      window.location.href = `mailto:nexuschangesuporte@gmail.com?subject=Ordem de Venda Cash-out&body=${encodeURIComponent(mensagemFinal)}`;
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 pb-20 animate-in fade-in duration-700">
      {/* HEADER */}
      <header className="p-6 flex items-center gap-4 bg-white border-b sticky top-0 z-50">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full">
          <ArrowLeft size={20} className="text-[#1a4571]" />
        </Button>
        <h1 className="text-xl font-black text-[#1a4571] uppercase italic tracking-tighter text-left">Vender Divisas</h1>
      </header>

      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-10 text-left">
        {/* CARROSSEL E CONTEÚDO DE VENDA ADAPTADO */}
        <section className="space-y-6">
          <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-[2.5rem] shadow-xl border border-white bg-[#1a4571]">
            {sellImages.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === imgIndex ? "opacity-100" : "opacity-0"}`}
                alt="Venda de divisas"
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a4571]/90 to-transparent flex items-end p-8">
              <p className="text-white font-bold text-lg md:text-xl leading-tight z-10">
                Converta o seu saldo internacional em Kwanza com liquidez imediata.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-[#1a4571]">
              <HandCoins size={24} />
              <h2 className="text-2xl font-black tracking-tight italic uppercase">Liquidez Instantânea</h2>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed">
              Precisa de Kwanzas rápido? Na Nexus Change, compramos o seu saldo em USD, EUR ou USDT e pagamos diretamente na sua conta em Angola. Processo seguro, sem taxas escondidas e com a melhor cotação através do nosso suporte direto.
            </p>
          </div>
        </section>

        {/* CONVERSOR DE CONSULTA DE VENDA */}
        <Card className="p-8 md:p-12 border-none shadow-2xl bg-white rounded-[2.5rem]">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 space-y-8">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Simulador de Venda</span>
                <h3 className="text-2xl font-black text-[#1a4571] italic tracking-tighter">Quanto deseja vender?</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest block">Valor que possui (Moeda Estrangeira)</label>
                  <Input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="h-16 text-2xl font-black border-slate-200 focus:border-[#1a4571] bg-slate-50/50 rounded-2xl"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <CurrencySelect 
                    label="Eu tenho" 
                    value={fromCurr} 
                    onChange={(val) => setFromCurr(val)} 
                  />
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest block">Receber em</label>
                    <div className="h-14 bg-slate-100/80 border border-slate-200/40 rounded-xl flex items-center px-4 font-black text-slate-700 text-sm">
                      AOA (Kwanza)
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTÃO CORRIGIDO E INTERLIGADO AO ATENDIMENTO WEB */}
              <Button 
                onClick={handleNegociarVenda}
                className="w-full h-16 bg-[#1a4571] hover:bg-black text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-blue-900/20 gap-3 group"
              >
                VENDER VIA OPERADOR
                <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
              </Button>
            </div>

            <div className="w-full lg:w-72 bg-[#1a4571] p-8 rounded-[2rem] text-white flex flex-col justify-between shadow-2xl overflow-hidden relative min-h-[220px]">
              <div>
                <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest block mb-4">Total a receber (Kz)</span>
                <ConversionResult 
                  amount={result} 
                  currency="AOA" 
                  fromCurrency={fromCurr}
                  rate={currentRate} 
                />
              </div>
              <div className="mt-6 pt-4 border-t border-blue-800/50 flex items-center gap-2">
                <ShieldCheck size={14} className="text-blue-300" />
                <span className="text-[9px] font-black uppercase text-blue-100 italic">Nexus Cash Out Fast</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Sell;