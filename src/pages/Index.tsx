import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { 
  ArrowUpDown, TrendingUp, TrendingDown, Phone
} from "lucide-react";

import CurrencySelect from "@/components/CurrencySelect";
import ConversionResult from "@/components/ConversionResult";
import { supabase } from "@/lib/supabase"; 

import {
  fetchLiveRate,
} from "@/lib/currencies";

export default function Index() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>("1000");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("AOA"); 
  const [liveRate, setLiveRate] = useState<number | null>(null);

  // CONFIGURAÇÃO DO WHATSAPP
  const WHATSAPP_NUMBER = "244928669514"; 

  const NEXUS_RATES: Record<string, number> = {
    "USD_AOA": 1150, "AOA_USD": 1 / 1250,
    "EUR_AOA": 1300, "AOA_EUR": 1 / 1400,
  };

  const numericAmount = useMemo(() => {
    const n = parseFloat(amount);
    return isNaN(n) ? 0 : n;
  }, [amount]);

  const isInternationalExchange = useMemo(() => {
    const coreCurrencies = ["USD", "EUR", "AOA"];
    return !coreCurrencies.includes(fromCurrency) || !coreCurrencies.includes(toCurrency);
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    async function loadRate() {
      const pair = `${fromCurrency}_${toCurrency}`;
      if (NEXUS_RATES[pair]) {
        setLiveRate(NEXUS_RATES[pair]);
      } else {
        try {
          const rate = await fetchLiveRate(fromCurrency, toCurrency);
          setLiveRate(rate);
        } catch (error) {
          setLiveRate(null);
        }
      }
    }
    loadRate();
  }, [fromCurrency, toCurrency]);

  const result = useMemo(() => {
    if (!liveRate) return 0;
    return numericAmount * liveRate;
  }, [numericAmount, liveRate]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleWhatsAppAction = async (side: "COMPRAR" | "VENDER") => {
    try {
      await supabase.from('site_stats').insert([
        { operation: side, amount: numericAmount, currency: fromCurrency }
      ]);
    } catch (e) { /* Silencioso */ }

    const formattedResult = result.toLocaleString(undefined, { minimumFractionDigits: 2 });
    const message = `Olá! Desejo ${side} ${amount} ${fromCurrency}. O site indicou o total de ${formattedResult} ${toCurrency}. Podemos avançar?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-start p-4 font-sans relative overflow-x-hidden">
      <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in duration-700 flex flex-col items-center">
        
        {/* HEADER - BOTÃO SOBRE NÓS RECUPERADO */}
        <header className="w-full flex justify-between items-center py-6 px-2">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
            <img src="/icon.png" alt="Nexus" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
            <h1 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-primary">Nexus Change</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/about")} 
              className="text-[10px] font-black uppercase px-4 py-2 hover:text-primary transition-colors"
            >
              Sobre Nós
            </button>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="text-[10px] font-black uppercase px-4 py-2 bg-foreground/5 rounded-xl flex items-center gap-2 hover:bg-foreground/10 transition-all border border-foreground/5">
              <Phone size={12} /> Suporte
            </a>
          </div>
        </header>

        {/* CARD PRINCIPAL */}
        <main className="w-full bg-card rounded-[3rem] p-6 md:p-10 border border-foreground/5 shadow-2xl space-y-8 relative overflow-hidden text-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 ml-2 italic">Montante</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                className="w-full h-24 bg-foreground/[0.02] rounded-[2rem] px-8 text-4xl font-black italic focus:outline-none border-2 border-transparent focus:border-primary/20 shadow-inner text-center" 
              />
            </div>

            <div className="grid grid-cols-[1fr_60px_1fr] items-end gap-3">
              <CurrencySelect label="Envias" value={fromCurrency} onChange={setFromCurrency} />
              <button onClick={handleSwap} className="h-16 flex items-center justify-center bg-primary/5 text-primary rounded-[1.5rem] border border-primary/10 hover:bg-primary/20 transition-all">
                <ArrowUpDown className="w-6 h-6" />
              </button>
              <CurrencySelect label="Recebes" value={toCurrency} onChange={setToCurrency} />
            </div>
          </div>

          {/* RESULTADOS - LIMPOS (SmartDecisionCard removido daqui) */}
          {numericAmount > 0 && (
            <div className="space-y-4 animate-in zoom-in-95 duration-300">
               <ConversionResult amount={result} currencyCode={toCurrency} />
               {liveRate && (
                <div className="flex justify-center items-center gap-2">
                  <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    1 {fromCurrency} = {liveRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
                  </span>
                </div>
               )}
            </div>
          )}

          {/* ÁREA DE AÇÃO */}
          <div className="pt-8 border-t border-foreground/5 space-y-5">
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-primary italic">
              {isInternationalExchange ? "Sugestão Internacional" : "Negociar em Angola via WhatsApp"}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!isInternationalExchange ? (
                <>
                  <button 
                    onClick={() => handleWhatsAppAction("COMPRAR")} 
                    className="flex flex-col items-center justify-center p-8 rounded-[2.5rem] bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all group shadow-sm"
                  >
                    <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
                    <span className="text-green-700 font-black uppercase italic text-sm">Comprar Agora</span>
                  </button>

                  <button 
                    onClick={() => handleWhatsAppAction("VENDER")} 
                    className="flex flex-col items-center justify-center p-8 rounded-[2.5rem] bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all group shadow-sm"
                  >
                    <TrendingDown className="w-8 h-8 text-blue-600 mb-2" />
                    <span className="text-blue-700 font-black uppercase italic text-sm">Vender Agora</span>
                  </button>
                </>
              ) : (
                <div className="col-span-2 grid grid-cols-3 gap-3">
                   <a href="https://www.binance.com" target="_blank" rel="noreferrer" className="p-6 rounded-[2rem] bg-orange-500/5 text-center font-black text-[10px] text-orange-600 border border-orange-500/10">Binance</a>
                   <a href="https://wise.com" target="_blank" rel="noreferrer" className="p-6 rounded-[2rem] bg-blue-500/5 text-center font-black text-[10px] text-blue-600 border border-blue-500/10">Wise</a>
                   <a href="https://www.westernunion.com" target="_blank" rel="noreferrer" className="p-6 rounded-[2rem] bg-yellow-500/5 text-center font-black text-[9px] text-yellow-700 border border-yellow-500/10">W. Union</a>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* FOOTER - LINKS DE NAVEGAÇÃO COMPLEMENTARES */}
        <footer className="w-full flex flex-col items-center gap-4 py-12">
          <div className="flex gap-6">
            <button onClick={() => navigate("/about")} className="text-[10px] font-black uppercase opacity-30 hover:opacity-100 transition-opacity">Sobre Nós</button>
            <button onClick={() => navigate("/privacy")} className="text-[10px] font-black uppercase opacity-30 hover:opacity-100 transition-opacity">Privacidade</button>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-foreground/20 italic">
            Nexus Change — Angola Hub
          </div>
        </footer>
      </div>
    </div>
  );
}