import { Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { ArrowUpDown, UserPlus, ShieldCheck, TrendingUp, TrendingDown } from "lucide-react";

import CurrencySelect from "@/components/CurrencySelect";
import ConversionResult from "@/components/ConversionResult";
import SmartDecisionCard from "@/components/SmartDecisionCard";

import {
  getSmartDecision,
  fetchLiveRate,
  generateCurrencyPairs
} from "@/lib/currencies";

export default function Index() {
  const [amount, setAmount] = useState<string>("1000");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [liveRate, setLiveRate] = useState<number | null>(null);

  const numericAmount = useMemo(() => {
    const n = parseFloat(amount);
    return isNaN(n) ? 0 : n;
  }, [amount]);

  const result = useMemo(() => {
    if (!liveRate) return 0;
    return numericAmount * liveRate;
  }, [numericAmount, liveRate]);

  useEffect(() => {
    async function loadRate() {
      try {
        const rate = await fetchLiveRate(fromCurrency, toCurrency);
        setLiveRate(rate);
      } catch (error) {
        console.error("Live rate failed");
        setLiveRate(null);
      }
    }
    loadRate();
  }, [fromCurrency, toCurrency]);

  const decision = useMemo(() => {
    return getSmartDecision(fromCurrency, toCurrency);
  }, [fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const timeString = useMemo(() => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

  const currencyPairs = useMemo(() => {
    return generateCurrencyPairs();
  }, []);

  const seoLinks = currencyPairs.slice(0, 60);

  const popularConversions = [
    { from: "USD", to: "AOA" },
    { from: "AOA", to: "USD" },
    { from: "EUR", to: "AOA" },
    { from: "AOA", to: "EUR" },
    { from: "BTC", to: "AOA" },
    { from: "ZAR", to: "AOA" },
    { from: "GBP", to: "AOA" }
  ];

  return (
    <div className="min-h-svh bg-background text-foreground flex flex-col items-center p-4">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        
        {/* HEADER */}
        <header className="space-y-2 text-center py-6">
          <div className="flex items-center justify-center gap-2">
            <img src="/icon.png" alt="Nexus Change Icon" className="w-8 h-8" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Nexus Change</h1>
          </div>
          <p className="text-sm text-foreground/60">Inteligência Cambial para Angola</p>
        </header>

        {/* MAIN CONVERTER CARD */}
        <div className="bg-card rounded-3xl p-6 shadow-xl border border-foreground/5 space-y-8">
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">Quantia</label>
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-14 bg-foreground/[0.03] rounded-xl px-4 text-2xl font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>

            <div className="grid grid-cols-[1fr_40px_1fr] items-end gap-2">
              <CurrencySelect label="De" value={fromCurrency} onChange={setFromCurrency} />
              <button onClick={handleSwap} className="h-14 flex items-center justify-center hover:bg-foreground/5 rounded-xl transition">
                <ArrowUpDown className="w-5 h-5 text-foreground/30" />
              </button>
              <CurrencySelect label="Para" value={toCurrency} onChange={setToCurrency} />
            </div>

            <div className="text-xs font-medium text-foreground/40 text-center py-2 bg-foreground/[0.02] rounded-full">
              1 {fromCurrency} = {liveRate ? liveRate.toFixed(4) : "..."} {toCurrency}
            </div>
          </div>

          {numericAmount > 0 && (
            <ConversionResult amount={result} currencyCode={toCurrency} />
          )}

          <SmartDecisionCard decision={decision} />

          {/* NOVOS BOTÕES: BUY & SELL NOW */}
          <div className="pt-6 border-t border-foreground/5 space-y-4">
            <p className="text-[10px] font-bold text-center uppercase tracking-widest text-primary/60">Operações Nexus Change</p>
            
            <div className="grid grid-cols-2 gap-4">
              <Link 
                to="/operation?type=buy" 
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition group"
              >
                <TrendingUp className="w-5 h-5 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-green-700 font-bold">Buy Now</span>
                <span className="text-[9px] text-green-600/60 uppercase font-medium">Comprar Moeda</span>
              </Link>

              <Link 
                to="/operation?type=sell" 
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition group"
              >
                <TrendingDown className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-blue-700 font-bold">Sell Now</span>
                <span className="text-[9px] text-blue-600/60 uppercase font-medium">Vender Moeda</span>
              </Link>
            </div>

            {/* BOTÃO DE REGISTO PROFISSIONAL */}
            <Link 
              to="/register" 
              className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg shadow-primary/20"
            >
              <UserPlus size={18} />
              Criar Conta Nexus
            </Link>
          </div>
        </div>

        {/* POPULAR & SEO LINKS */}
        <div className="space-y-8 pt-6">
          <div className="space-y-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">Conversões Populares em Angola</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularConversions.map((c, i) => (
                <Link key={i} to={`/convert/${c.from.toLowerCase()}/${c.to.toLowerCase()}`} className="text-xs px-4 py-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 font-medium transition">
                  {c.from} → {c.to}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4 text-center border-t border-foreground/5 pt-10">
            <h2 className="text-lg font-bold">Câmbio e Remessas Internacionais</h2>
            <p className="text-sm text-foreground/50 leading-relaxed max-w-xl mx-auto">
              O <strong>Nexus Change</strong> oferece taxas em tempo real para o mercado angolano. 
              Facilitamos a compra e venda de moedas para quem utiliza plataformas como <strong>Wise</strong>, <strong>Western Union</strong> e <strong>Binance</strong>. 
              Segurança e rapidez para freelancers e empresas.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {seoLinks.map((pair, i) => (
              <Link key={i} to={`/convert/${pair.from.toLowerCase()}/${pair.to.toLowerCase()}`} className="text-[10px] px-2 py-2 rounded-lg bg-foreground/[0.02] hover:bg-foreground/5 text-foreground/40 transition">
                {pair.from} → {pair.to}
              </Link>
            ))}
          </div>
        </div>

        {/* FOOTER INFO */}
        <footer className="flex justify-between items-center text-[10px] uppercase text-foreground/20 py-8">
          <div className="flex items-center gap-1"><ShieldCheck size={12}/> Dados de Mercado Seguros</div>
          <span>Atualizado: {timeString}</span>
        </footer>
      </div>
    </div>
  );
}