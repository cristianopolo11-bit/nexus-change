import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { 
  ArrowUpDown, TrendingUp, TrendingDown, Phone, ShieldCheck, Zap, Award
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
    const formattedResult = result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const message = `Olá! Desejo ${side} ${amount} ${fromCurrency}. O site indicou o total de ${formattedResult} ${toCurrency}. Podemos avançar?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    supabase.from('site_stats').insert([
      { operation: side, amount: numericAmount, currency: fromCurrency }
    ]).then(({ error }) => {
      if (error) console.warn("Erro ao gravar estatística:", error.message);
    });

    const newWindow = window.open(whatsappUrl, "_blank");
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = whatsappUrl;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F1A] text-slate-100 flex flex-col items-center justify-start p-4 font-sans relative overflow-x-hidden selection:bg-primary/30">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in duration-1000 flex flex-col items-center relative z-10">
        
        {/* HEADER CORRIGIDO COM ÍCONE VISÍVEL */}
        <header className="w-full flex justify-between items-center py-6 px-2">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="relative">
              {/* Brilho Neon Atrás do Ícone */}
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full group-hover:bg-primary/50 transition-all duration-500" />
              <img 
                src="/icon.png" 
                alt="Nexus Logo" 
                className="relative w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-[0_0_8px_rgba(var(--primary),0.5)] transition-transform duration-500 group-hover:scale-110" 
              />
            </div>
            <h1 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
              Nexus Change
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate("/about")} 
              className="hidden md:block text-[10px] font-bold uppercase px-4 py-2 hover:text-primary transition-colors text-slate-400"
            >
              Sobre
            </button>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase px-5 py-2.5 bg-white/5 hover:bg-primary/10 rounded-full border border-white/10 hover:border-primary/30 transition-all flex items-center gap-2 shadow-xl shadow-black/20">
              <Phone size={12} className="text-primary" /> Suporte VIP
            </a>
          </div>
        </header>

        {/* TITULO HERO */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white">Nexus Exchange Hub</h2>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest text-center">Nexus Rates Ativas</span>
          </div>
        </div>

        {/* CARD PRINCIPAL (GLASS) */}
        <main className="w-full bg-white/[0.03] backdrop-blur-xl rounded-[3rem] p-1 border border-white/10 shadow-2xl">
          <div className="bg-[#121826]/80 rounded-[2.8rem] p-6 md:p-10 space-y-8 relative overflow-hidden">
            
            {/* Marca d'água discreta */}
            <img src="/icon.png" className="absolute -right-12 -bottom-12 w-48 h-48 opacity-[0.02] pointer-events-none rotate-12" alt="" />

            <div className="space-y-6">
              <div className="space-y-3 text-center">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">Montante de Envio</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  className="w-full h-24 bg-white/[0.02] rounded-[2rem] px-8 text-4xl font-black italic focus:outline-none border border-white/5 focus:border-primary/30 transition-all text-center shadow-inner placeholder:text-slate-800" 
                />
              </div>

              <div className="grid grid-cols-[1fr_64px_1fr] items-end gap-3 px-2">
                <CurrencySelect label="Eu tenho" value={fromCurrency} onChange={setFromCurrency} />
                <button onClick={handleSwap} className="h-16 flex items-center justify-center bg-primary/10 text-primary rounded-2xl border border-primary/20 hover:bg-primary/20 transition-all active:scale-90">
                  <ArrowUpDown className="w-6 h-6" />
                </button>
                <CurrencySelect label="Eu quero" value={toCurrency} onChange={setToCurrency} />
              </div>
            </div>

            {/* RESULTADOS */}
            {numericAmount > 0 && (
              <div className="space-y-4 animate-in zoom-in-95 duration-500">
                 <div className="bg-white/[0.02] py-6 rounded-[2rem] border border-white/5 text-center relative z-10">
                   <ConversionResult amount={result} currencyCode={toCurrency} />
                 </div>
                 {liveRate && (
                  <div className="flex justify-center">
                    <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 tracking-wider uppercase text-center">
                      Câmbio: 1 {fromCurrency} = {liveRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
                    </span>
                  </div>
                 )}
              </div>
            )}

            {/* ÁREA DE AÇÃO */}
            <div className="pt-8 border-t border-white/5 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!isInternationalExchange ? (
                  <>
                    <button 
                      onClick={() => handleWhatsAppAction("COMPRAR")} 
                      className="flex flex-col items-center justify-center p-6 rounded-[2rem] bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group active:scale-95 shadow-lg shadow-emerald-900/10"
                    >
                      <TrendingUp className="w-7 h-7 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-emerald-400 font-black uppercase italic text-xs tracking-widest text-center">Comprar Agora</span>
                    </button>

                    <button 
                      onClick={() => handleWhatsAppAction("VENDER")} 
                      className="flex flex-col items-center justify-center p-6 rounded-[2rem] bg-gradient-to-br from-blue-500/20 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 transition-all group active:scale-95 shadow-lg shadow-blue-900/10"
                    >
                      <TrendingDown className="w-7 h-7 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-blue-400 font-black uppercase italic text-xs tracking-widest text-center">Vender Agora</span>
                    </button>
                  </>
                ) : (
                  <div className="col-span-2 space-y-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 text-center italic mb-2">Alternativas Internacionais</p>
                    <div className="grid grid-cols-3 gap-2">
                      <a href="https://www.binance.com" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-orange-500/10 transition-all group">
                        <span className="font-black text-[10px] text-orange-500 uppercase tracking-tighter text-center">Binance</span>
                      </a>
                      <a href="https://wise.com" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-blue-500/10 transition-all group">
                        <span className="font-black text-[10px] text-blue-400 uppercase tracking-tighter text-center">Wise</span>
                      </a>
                      <a href="https://www.westernunion.com" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-yellow-500/10 transition-all group">
                        <span className="font-black text-[10px] text-yellow-600 uppercase tracking-tighter text-center">W. Union</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* TRUST BADGES */}
        <section className="w-full grid grid-cols-3 gap-3 md:gap-6">
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-3xl flex flex-col items-center text-center gap-2 group hover:bg-white/[0.04] transition-all">
              <ShieldCheck size={20} className="text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter text-center leading-tight">Segurança Total</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-3xl flex flex-col items-center text-center gap-2 group hover:bg-white/[0.04] transition-all">
              <Award size={20} className="text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter text-center leading-tight">Melhor Taxa</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-3xl flex flex-col items-center text-center gap-2 group hover:bg-white/[0.04] transition-all">
              <Zap size={20} className="text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter text-center leading-tight">Rapidez Whatsapp</span>
            </div>
        </section>

        {/* FOOTER */}
        <footer className="w-full flex flex-col items-center gap-6 py-12 border-t border-white/5 mt-10">
          <div className="flex gap-8 text-center">
            <button onClick={() => navigate("/about")} className="text-[10px] font-bold uppercase text-slate-500 hover:text-primary transition-colors">Sobre Nós</button>
            <button onClick={() => navigate("/privacy")} className="text-[10px] font-bold uppercase text-slate-500 hover:text-primary transition-colors">Privacidade</button>
            <button className="text-[10px] font-bold uppercase text-slate-500 hover:text-primary transition-colors">Termos</button>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 italic text-center">
              © 2026 NEXUS CHANGE — ANGOLA HUB
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}