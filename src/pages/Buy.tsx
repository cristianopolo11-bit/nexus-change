import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { convert, getExchangeRate } from "@/lib/currencies";
import { 
  ArrowLeft, 
  Send, 
  ShieldCheck, 
  ChevronDown, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Zap, 
  CheckCircle2, 
  Info, 
  Copy, 
  ArrowRightLeft, 
  Wallet, 
  Clock, 
  Star, 
  AlertCircle,
  Mail,
  Globe,
  HelpCircle
} from "lucide-react";

// ─── DADOS ──────────────────────────────────────────────────────────
const CURRENCIES = [
  "AOA", "USD", "EUR", "BRL", "USDT", "USDC", 
  "ZAR", "GBP", "CAD", "AUD", "CNY", "XAF"
];
const WHATSAPP_NUMBER = "244928669514";

// ─── UTILITÁRIOS ────────────────────────────────────────────────────
const formatCurrency = (value: number) =>
  value.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatRate = (value: number) =>
  value.toLocaleString("pt-PT", { maximumFractionDigits: 5 });

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ─── COMPONENTE: DROPDOWN DE MOEDA ──────────────────────────────────
interface CurrencySelectProps {
  value: string;
  onChange: (c: string) => void;
  label: string;
  variant?: "light" | "dark";
}

const CurrencySelect = ({ value, onChange, label, variant = "light" }: CurrencySelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isDark = variant === "dark";

  return (
    <div ref={ref} className="relative shrink-0">
      <label className="sr-only">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`shadow-lg border-2 rounded-2xl p-3 font-black text-sm min-w-[100px] sm:min-w-[110px] flex items-center justify-center gap-1.5 outline-none transition-all duration-300 hover:scale-105 active:scale-95 ${
          isDark 
            ? "bg-amber-400 border-amber-500 text-[#1a4571] hover:bg-amber-300 focus:ring-4 focus:ring-amber-200" 
            : "bg-white border-amber-200 text-[#1a4571] hover:border-amber-400 focus:ring-4 focus:ring-amber-100"
        }`}
        aria-label={`Moeda selecionada: ${value}. Clique para alterar.`}
        aria-expanded={open}
      >
        <span className="text-base sm:text-lg">{value}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-[100] mt-2 w-32 bg-white border-2 border-amber-200 rounded-2xl shadow-2xl max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => { onChange(c); setOpen(false); }}
              className={`w-full text-center py-3 text-sm font-bold transition-all duration-200 hover:scale-105 ${
                c === value 
                  ? "bg-amber-400 text-[#1a4571] shadow-inner" 
                  : "text-slate-700 hover:bg-amber-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── COMPONENTE PRINCIPAL ───────────────────────────────────────────
const Buy = () => {
  const navigate = useNavigate();

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientCountry, setClientCountry] = useState("");
  const [amount, setAmount] = useState<number>(1000);
  const [result, setResult] = useState<number>(0);
  const [currentRate, setCurrentRate] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [fromCurr, setFromCurr] = useState("AOA");
  const [toCurr, setToCurr] = useState("EUR");
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [rateTrend, setRateTrend] = useState<"up" | "down" | "stable">("stable");
  const [prevRate, setPrevRate] = useState<number>(0);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRateHistory, setShowRateHistory] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [amountError, setAmountError] = useState<string | null>(null);

  const fetchConversion = useCallback(async () => {
    if (amount <= 0) {
      setResult(0);
      setCurrentRate(0);
      setConversionError(null);
      return;
    }

    setIsLoading(true);
    setConversionError(null);

    try {
      const baseRate = getExchangeRate(fromCurr, toCurr, false);
      const totalConvertido = await convert(amount, fromCurr, toCurr, false);

      if (typeof totalConvertido !== "number" || isNaN(totalConvertido) || totalConvertido <= 0) {
        throw new Error("Resposta inválida da conversão");
      }

      setResult(totalConvertido);
      const finalRate = baseRate && baseRate > 0 ? baseRate : (totalConvertido / amount);

      if (prevRate > 0) {
        if (finalRate > prevRate * 1.001) setRateTrend("up");
        else if (finalRate < prevRate * 0.999) setRateTrend("down");
        else setRateTrend("stable");
      }
      
      setPrevRate(currentRate);
      setCurrentRate(finalRate);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Erro na conversão:", error);
      setConversionError("Não foi possível obter a cotação. Tenta novamente.");
      const fallbackRate = getExchangeRate(fromCurr, toCurr, false) ?? 0;
      setCurrentRate(fallbackRate);
      setResult(amount * fallbackRate);
    } finally {
      setIsLoading(false);
    }
  }, [amount, fromCurr, toCurr, currentRate, prevRate]);

  useEffect(() => {
    fetchConversion();
  }, [fetchConversion]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversion();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchConversion]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      setAmount(0);
      setAmountError(null);
      return;
    }
    const val = parseFloat(raw);
    if (!isNaN(val) && val >= 0) {
      setAmount(val);
      if (val > 10000000) {
        setAmountError("Valor elevado. Contacte-nos para valores acima de 10M.");
      } else {
        setAmountError(null);
      }
    }
  };

  const handleSwap = () => {
    setIsFlipped(true);
    setTimeout(() => {
      const temp = fromCurr;
      setFromCurr(toCurr);
      setToCurr(temp);
      setIsFlipped(false);
    }, 300);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(formatCurrency(result) + " " + toCurr);
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchConversion().then(() => {
      setTimeout(() => setIsRefreshing(false), 800);
    });
  };

  const handleFinalizarCompra = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || !clientCountry.trim()) {
      alert("Por favor, preencha o seu nome e o país de destino.");
      return;
    }

    if (clientEmail.trim() && !isValidEmail(clientEmail)) {
      alert("Por favor, insira um endereço de email válido.");
      return;
    }

    if (amount <= 0) {
      alert("O valor a comprar deve ser superior a zero.");
      return;
    }

    const mensagem =
      `🚀 *SOLICITAÇÃO DE COMPRA DE MOEDA (NEXUS)*\n\n` +
      `👤 *CLIENTE:*\n` +
      `• Nome: ${clientName.trim()}\n` +
      `• Email: ${clientEmail.trim() ? clientEmail.trim() : "Não informado"}\n` +
      `• País de Destino: ${clientCountry.trim()}\n\n` +
      `💵 *DADOS DA OPERAÇÃO:*\n` +
      `• Entrega: ${formatCurrency(amount)} ${fromCurr}\n` +
      `• Recebe Estimado: ${formatCurrency(result)} ${toCurr}\n` +
      `• Taxa Comercial: 1 ${fromCurr} = ${formatRate(currentRate)} ${toCurr}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen w-full bg-amber-50 font-sans text-slate-900 antialiased pb-12 sm:pb-24 selection:bg-amber-200 selection:text-[#1a4571]">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-400/20 animate-pulse" />
          <div className="text-5xl sm:text-6xl animate-bounce">🎉</div>
        </div>
      )}

      {/* HEADER ADAPTADO */}
      <header className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-amber-200 sticky top-0 bg-amber-50/95 backdrop-blur z-50">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/services")}
            className="rounded-full hover:bg-amber-200 h-10 w-10 transition-all duration-300 active:scale-95 shrink-0"
            aria-label="Voltar"
          >
            <ArrowLeft size={20} className="text-[#1a4571]" />
          </Button>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center shadow-lg shrink-0">
              <Zap size={16} className="text-[#1a4571]" />
            </div>
            <span className="text-xs sm:text-sm font-black text-[#1a4571] tracking-wider uppercase whitespace-nowrap">
              Nexus Compra
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <button 
            onClick={handleManualRefresh}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all duration-500 shadow-sm border border-amber-200 bg-white text-slate-600 hover:bg-amber-100 ${
              isRefreshing ? "animate-pulse text-amber-500" : ""
            }`}
          >
            <RefreshCw size={12} className={isRefreshing ? "animate-spin text-[#1a4571]" : ""} />
            <span className="text-[11px] sm:inline">Atualizar</span>
          </button>
          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#1a4571] bg-amber-400 px-2.5 py-1.5 rounded-full shadow-md whitespace-nowrap">
            <ShieldCheck size={14} className="shrink-0" />
            <span>Segura</span>
          </div>
        </div>
      </header>

      {/* FLUXO PRINCIPAL RECONFIGURADO PARA MOBILE */}
      <main className="max-w-5xl mx-auto px-4 mt-6 sm:mt-8 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        
        {/* COLUNA ESQUERDA: FORMULÁRIO */}
        <div className="w-full lg:w-[42%] space-y-5 sm:space-y-6 text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-amber-400 px-3 py-1 rounded-full text-[11px] font-black text-[#1a4571] shadow-sm">
              <Star size={12} fill="currentColor" />
              <span>Taxas em tempo real</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a4571] tracking-tight leading-tight">
              Compre com segurança para mais de 10 moedas
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              O valor calculado já contempla o câmbio e todas as taxas do mercado.
            </p>
          </div>

          <form onSubmit={handleFinalizarCompra} id="buy-form" className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-amber-200 shadow-lg space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Wallet size={16} className="text-amber-500" />
              <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">
                Dados do Comprador
              </span>
            </div>

            <div className="relative group">
              <label htmlFor="client-name" className="sr-only">Nome completo</label>
              <Input
                id="client-name"
                type="text"
                required
                placeholder="Seu nome completo"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="bg-amber-50/50 h-12 sm:h-14 rounded-xl border-2 border-amber-200 focus-visible:ring-4 focus-visible:ring-amber-300 focus-visible:border-amber-400 transition-all duration-300 text-sm sm:text-base font-bold placeholder:font-normal"
              />
              {clientName && (
                <CheckCircle2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
              )}
            </div>

            <div className="relative group">
              <label htmlFor="client-email" className="sr-only">Endereço de email</label>
              <Input
                id="client-email"
                type="email"
                required
                placeholder="Seu endereço de email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="bg-amber-50/50 h-12 sm:h-14 rounded-xl border-2 border-amber-200 focus-visible:ring-4 focus-visible:ring-amber-300 focus-visible:border-amber-400 transition-all duration-300 text-sm sm:text-base font-bold placeholder:font-normal pr-10"
              />
              <Mail size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              {isValidEmail(clientEmail) && (
                <CheckCircle2 size={16} className="absolute right-9 top-1/2 -translate-y-1/2 text-emerald-500" />
              )}
            </div>

            <div className="relative group">
              <label htmlFor="client-country" className="sr-only">País de destino</label>
              <Input
                id="client-country"
                type="text"
                required
                placeholder="País de destino do saldo"
                value={clientCountry}
                onChange={(e) => setClientCountry(e.target.value)}
                className="bg-amber-50/50 h-12 sm:h-14 rounded-xl border-2 border-amber-200 focus-visible:ring-4 focus-visible:ring-amber-300 focus-visible:border-amber-400 transition-all duration-300 text-sm sm:text-base font-bold placeholder:font-normal pr-10"
              />
              <Globe size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              {clientCountry.trim().length > 2 && (
                <CheckCircle2 size={16} className="absolute right-9 top-1/2 -translate-y-1/2 text-emerald-500" />
              )}
            </div>

            <div className="bg-amber-100/60 rounded-xl p-3 flex items-start gap-2 border border-amber-200">
              <Info size={14} className="text-amber-600 mt-0.5 shrink-0" />
              <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                Os dados são enviados diretamente via WhatsApp. Não guardamos informações pessoais nos nossos servidores.
              </p>
            </div>
          </form>
        </div>

        {/* COLUNA DIREITA: SIMULADOR */}
        <div className="w-full lg:flex-1">
          <div className="bg-white rounded-[2rem] border-4 border-amber-400 shadow-2xl p-4 sm:p-6 space-y-5 sm:space-y-6 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-200 rounded-full opacity-50 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-300 rounded-full opacity-30 blur-3xl pointer-events-none" />
            
            <div className="relative flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 sm:w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                  <ArrowRightLeft size={18} className="text-[#1a4571]" />
                </div>
                <div className="text-left">
                  <h2 className="text-base sm:text-lg font-black text-[#1a4571]">Câmbio</h2>
                  <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 whitespace-nowrap">
                    <Clock size={11} />
                    Atualizado às {lastUpdated.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSwap}
                className="p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 transition-all duration-300 hover:scale-110 active:scale-95 shadow-md shrink-0"
                title="Inverter moedas"
              >
                <ArrowRightLeft size={16} className={isFlipped ? "rotate-180 text-[#1a4571]" : "text-[#1a4571]"} />
              </button>
            </div>

            {/* Caixa: Valor de Entrega */}
            <div className={`bg-amber-50 rounded-2xl p-4 sm:p-5 border-2 border-amber-200 flex items-center justify-between gap-3 transition-all duration-300 ${inputFocused ? "ring-4 ring-amber-300 border-amber-400 shadow-lg" : "shadow-md"}`}>
              <div className="flex flex-col text-left w-full min-w-0">
                <label htmlFor="buy-amount" className="text-[11px] font-black text-amber-600 uppercase tracking-wider flex items-center gap-1 truncate">
                  <TrendingDown size={12} />
                  Tu entregas
                </label>
                <input
                  id="buy-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount || ""}
                  onChange={handleAmountChange}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="bg-transparent text-2xl sm:text-3xl font-black text-[#1a4571] outline-none w-full mt-1.5 placeholder:text-amber-300 min-w-0"
                  placeholder="0"
                />
                {amountError && (
                  <span className="text-[10px] text-red-500 font-bold mt-1 leading-tight">{amountError}</span>
                )}
              </div>
              <CurrencySelect
                value={fromCurr}
                onChange={setFromCurr}
                label="Moeda de entrega"
              />
            </div>

            {/* Fluxo Intermédio */}
            <div className="relative pl-6 sm:pl-8 space-y-2.5 border-l-4 border-dashed border-amber-300 ml-3 sm:ml-4 text-left">
              <div className="flex flex-wrap items-center gap-2 text-slate-700 font-bold bg-amber-100/70 py-2.5 px-3 sm:px-4 rounded-xl border-2 border-amber-200 shadow-sm text-xs sm:text-sm">
                <span className="font-black text-[#1a4571]">Cotação:</span>
                <span className="font-mono font-black text-[#1a4571]">
                  {isLoading ? (
                    <span className="flex items-center gap-1.5"><RefreshCw size={12} className="animate-spin" /> A calcular...</span>
                  ) : (
                    `1 ${fromCurr} = ${formatRate(currentRate)} ${toCurr}`
                  )}
                </span>
                {!isLoading && rateTrend !== "stable" && (
                  <span className={`flex items-center gap-0.5 text-[11px] font-black ${rateTrend === "up" ? "text-emerald-600" : "text-red-500"}`}>
                    {rateTrend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {rateTrend === "up" ? "Subiu" : "Desceu"}
                  </span>
                )}
              </div>
              
              {conversionError && (
                <div className="text-red-600 text-[11px] font-bold bg-red-50 py-2 px-3 rounded-xl border-2 border-red-200 flex items-center gap-1.5">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{conversionError}</span>
                </div>
              )}
              
              <button
                type="button"
                onClick={() => setShowRateHistory(!showRateHistory)}
                className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors outline-none"
              >
                <TrendingUp size={11} />
                {showRateHistory ? "Ocultar detalhes" : "Ver detalhes da taxa"}
              </button>
              
              {showRateHistory && (
                <div className="bg-white rounded-xl p-3 border border-amber-200 text-[11px] space-y-1.5 animate-in slide-in-from-top-2 max-w-xs">
                  <div className="flex justify-between font-bold text-slate-600 gap-4">
                    <span>Taxa atual:</span>
                    <span className="text-[#1a4571] font-mono">{formatRate(currentRate)} {toCurr}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-600 gap-4">
                    <span>Sincronização:</span>
                    <span>{lastUpdated.toLocaleTimeString("pt-PT")}</span>
                  </div>
                </div>
              )}
            </div>

            {/* CARD "TU RECEBES" PREMIUM ADAPTADO */}
            <div className="bg-[#1a4571] rounded-2xl p-4 sm:p-6 shadow-2xl border-4 border-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a4571] to-[#0f2d4d] rounded-xl" />
              
              <div className="relative flex flex-col text-white z-10 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shrink-0">
                    <TrendingUp size={11} className="text-[#1a4571]" />
                  </div>
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider truncate">
                    Tu recebes estimado
                  </span>
                </div>
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mt-1 truncate drop-shadow-md">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw size={22} className="animate-spin text-amber-400" />
                      <span className="text-amber-400 text-xl">...</span>
                    </span>
                  ) : (
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-xl sm:text-2xl text-amber-400">{toCurr}</span>
                      <span className="font-mono">{formatCurrency(result)}</span>
                    </div>
                  )}
                </span>
                {!isLoading && result > 0 && (
                  <span className="text-[10px] text-amber-300/90 font-medium mt-2 flex items-center gap-1">
                    <CheckCircle2 size={11} className="shrink-0 text-emerald-400" />
                    <span>Valor calculado com taxa comercial</span>
                  </span>
                )}
              </div>
              
              <div className="relative z-10 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t border-white/10 sm:border-none">
                <CurrencySelect
                  value={toCurr}
                  onChange={setToCurr}
                  label="Moeda a receber"
                  variant="dark"
                />
                <button
                  type="button"
                  onClick={handleCopyAmount}
                  className={`flex items-center gap-1 px-3 py-2 h-10 rounded-xl font-bold text-xs transition-all duration-300 active:scale-95 shadow-lg ${
                    copiedAmount 
                      ? "bg-emerald-500 text-white" 
                      : "bg-amber-400 text-[#1a4571] hover:bg-amber-300"
                  }`}
                  title="Copiar valor"
                >
                  {copiedAmount ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                  <span>{copiedAmount ? "Copiado" : "Copiar"}</span>
                </button>
              </div>
            </div>

            {/* BOTÃO COMPRAR */}
            <Button
              type="submit"
              form="buy-form"
              disabled={isLoading || !!conversionError || amount <= 0}
              className="w-full h-14 sm:h-16 bg-[#1a4571] hover:bg-[#0f2d4d] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base rounded-2xl transition-all duration-300 uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] active:scale-[0.99]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw size={16} className="animate-spin" />
                  A CALCULAR...
                </span>
              ) : (
                <>
                  <span>COMPRAR</span>
                  <Send size={16} />
                </>
              )}
            </Button>

            {/* ELEMENTOS DE SEGURANÇA E TEXTOS INSTITUCIONAIS SOLICITADOS */}
            <div className="flex flex-col items-center justify-center gap-2.5 pt-3 border-t border-amber-100 text-[11px] font-bold text-slate-500 text-center">
              <div className="flex items-center justify-center gap-1.5 text-amber-600">
                <HelpCircle size={14} className="shrink-0" />
                <span>Suporte ao cliente 24 horas por dia.</span>
              </div>
              
              <p className="max-w-md text-slate-400 leading-relaxed font-medium">
                Tráfego directo via WhatsApp: não realizamos a coleta ou armazenamento de dados pessoais em nosso sistema.
              </p>
              
              <p className="text-[#1a4571] font-extrabold uppercase tracking-wide text-[10px]">
                Instituição de referência para a movimentação segura dos seus ativos.
              </p>

              <div className="flex items-center justify-center gap-3 text-[10px] font-bold text-slate-400 pt-1 flex-wrap">
                <span className="flex items-center gap-0.5 text-slate-400/80"><ShieldCheck size={12} className="text-emerald-500" /> SSL Seguro</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="flex items-center gap-0.5 text-slate-400/80"><Zap size={12} className="text-amber-500" /> Processamento Instantâneo</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Buy;