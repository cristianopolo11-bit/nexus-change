import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CurrencySelect from "@/components/CurrencySelect";
import ConversionResult from "@/components/ConversionResult";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { convert, getExchangeRate } from "@/lib/currencies";
import { ArrowLeft, MessageSquare, ShieldCheck, Wallet } from "lucide-react";
import { ChatNexusModal } from "@/components/ChatNexusModal"; 

const Buy = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(100);
  const [result, setResult] = useState<number>(0);
  const [currentRate, setCurrentRate] = useState<number>(0);
  const [fromCurr, setFromCurr] = useState("USD");
  const [toCurr, setToCurr] = useState("AOA");
  
  const [isChatOpen, setIsChatOpen] = useState(false);

  const buyImages = [
    "https://images.unsplash.com/photo-1611974714658-30d06154625b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"
  ];
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (imgIndex + 1) % buyImages.length;
      const imgCache = new Image();
      imgCache.src = buyImages[nextIndex];
      imgCache.onload = () => {
        setImgIndex(nextIndex);
      };
    }, 4500);
    return () => clearInterval(timer);
  }, [imgIndex, buyImages.length]);

  useEffect(() => {
    const updateResult = async () => {
      try {
        const rateValue = await convert(1, fromCurr, toCurr, false);
        const finalRate = rateValue && rateValue > 0 
          ? rateValue 
          : getExchangeRate(fromCurr, toCurr, false);
        
        setCurrentRate(finalRate);
        setResult(amount * finalRate);
      } catch (error) {
        console.error("Erro na conversão de compra:", error);
        const fallbackRate = getExchangeRate(fromCurr, toCurr, false);
        setCurrentRate(fallbackRate);
        setResult(amount * fallbackRate);
      }
    };
    updateResult();
  }, [amount, fromCurr, toCurr]);

  // FIX: Nome da função corrigido para bater certo com o onClick do teu botão!
  const handleNegociarOperador = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 pb-20 animate-in fade-in duration-700 font-sans text-left">
      <header className="p-6 flex items-center gap-4 bg-white border-b sticky top-0 z-50">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full">
          <ArrowLeft size={20} className="text-[#1a4571]" />
        </Button>
        <h1 className="text-xl font-black text-[#1a4571] uppercase italic tracking-tighter text-left">Comprar Divisas</h1>
      </header>

      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-10 text-left">
        <section className="space-y-6">
          <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-[2.5rem] shadow-xl border border-white bg-[#1a4571]">
            {buyImages.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === imgIndex ? "opacity-100" : "opacity-0"}`}
                alt="Compra de divisas"
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a4571]/80 to-transparent flex items-end p-8">
              <p className="text-white font-bold text-lg md:text-xl leading-tight z-10">
                Adquira Dólares, Euros ou Stablecoins com as melhores taxas de Angola.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-[#1a4571]">
              <Wallet size={24} />
              <h2 className="text-2xl font-black tracking-tight italic uppercase">Compra Segura Nexus</h2>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed">
              Na Nexus Change, comprar divisas é simples. Você envia o seu Kwanza via transferência (IBAN ou Multicaixa Express) e recebe o valor correspondente na sua conta internacional ou carteira digital através da nossa mesa de negociação humana.
            </p>
          </div>
        </section>

        <Card className="p-8 md:p-12 border-none shadow-2xl bg-white rounded-[2.5rem]">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 space-y-8">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Simulador Web</span>
                <h3 className="text-2xl font-black text-[#1a4571] italic tracking-tighter">Quanto deseja comprar?</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest block">Valor a comprar (Moeda Estrangeira)</label>
                  <Input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="h-16 text-2xl font-black border-slate-200 focus:border-[#1a4571] bg-slate-50/50 rounded-2xl"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <CurrencySelect 
                    label="Eu quero" 
                    value={fromCurr} 
                    onChange={(val) => setFromCurr(val)} 
                  />
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest block">Pagar em</label>
                    <div className="h-14 bg-slate-100/80 border border-slate-200/40 rounded-xl flex items-center px-4 font-black text-slate-700 text-sm">
                      AOA (Kwanza)
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleNegociarOperador}
                className="w-full h-16 bg-[#1a4571] hover:bg-black text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-blue-900/20 gap-3 group"
              >
                NEGOCIAR COM OPERADOR
                <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
              </Button>
            </div>

            <div className="w-full lg:w-72 bg-[#1a4571] p-8 rounded-[2rem] text-white flex flex-col justify-between shadow-2xl overflow-hidden relative min-h-[220px]">
              <div>
                <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest block mb-4">Total estimado a pagar</span>
                <ConversionResult 
                  amount={result} 
                  currency="AOA" 
                  fromCurrency={fromCurr}
                  rate={currentRate} 
                />
              </div>
              <div className="mt-6 pt-4 border-t border-blue-800/50 flex items-center gap-2">
                <ShieldCheck size={14} className="text-blue-300" />
                <span className="text-[9px] font-black uppercase text-blue-100 italic">Cotação Direta Nexus</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <ChatNexusModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        contexto={`Compra de ${amount} ${fromCurr} por ${result.toLocaleString('pt-PT')} AOA`} 
      />
    </div>
  );
};

export default Buy;