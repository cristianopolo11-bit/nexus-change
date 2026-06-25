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
  Landmark
} from "lucide-react";

// ─── DADOS ──────────────────────────────────────────────────────────
const CURRENCIES = [
  "USD", "EUR", "USDT", "USDC", "BRL", "ZAR", "GBP", "AOA"
];
const WHATSAPP_NUMBER = "244928669514";

const POPULAR_PAIRS = [
  { from: "USD", to: "AOA", label: "USD → AOA" },
  { from: "EUR", to: "AOA", label: "EUR → AOA" },
  { from: "USDT", to: "AOA", label: "USDT → AOA" },
  { from: "BRL", to: "AOA", label: "BRL → AOA" },
];

// ─── UTILITÁRIOS ────────────────────────────────────────────────────
const formatCurrency = (value: number) =>
  value.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatRate = (value: number) =>
  value.toLocaleString("pt-PT", { maximumFractionDigits: 5 });

const isValidAngolanPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\s/g, "").replace(/^\+?244/, "");
  return /^9\d{8}$/.test(cleaned);
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
    <div ref={ref} className="relative">
      <label className="sr-only">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`shadow-lg border-2 rounded-2xl p-3 font-black text-sm min-w-[110px] flex items-center justify-center gap-2 outline-none transition-all duration-300 hover:scale-105 active:scale-95 ${
          isDark
            ? "bg-amber-400 border-amber-500 text-[#1a4571] hover:bg-amber-300 focus:ring-4 focus:ring-amber-200"
            : "bg-white border-amber-200 text-[#1a4571] hover:border-amber-400 focus:ring-4 focus:ring-amber-100"
        }`}
        aria-label={`Moeda selecionada: ${value}. Clique para alterar.`}
        aria-expanded={open}
      >
        <span className="text-lg">{value}</span>
        <ChevronDown size={16} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
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

// ─── COMPONENTE: CHIP DE PAR POPULAR ────────────────────────────────
interface PopularPairChipProps {
  pair: { from: string; to: string; label: string };
  isActive: boolean;
  onClick: () => void;
}

const PopularPairChip = ({ pair, isActive, onClick }: PopularPairChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap ${
      isActive
        ? "bg-amber-400 text-[#1a4571] shadow-lg scale-105 ring-2 ring-amber-500"
        : "bg-white/80 text-slate-600 hover:bg-amber-100 hover:scale-105 border border-amber-200"
    }`}
  >
    {pair.label}
  </button>
);

// ─── COMPONENTE PRINCIPAL ───────────────────────────────────────────
const Sell = () => {
  const navigate = useNavigate();

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientBank, setClientBank] = useState("");
  const [clientIban, setClientIban] = useState("");

  const [amount, setAmount] = useState<number>(100);
  const [result, setResult] = useState<number>(0);
  const [currentRate, setCurrentRate] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [fromCurr, setFromCurr] = useState("USD");
  const [toCurr, setToCurr] = useState("AOA");

  const [isFlipped, setIsFlipped] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [rateTrend, setRateTrend] = useState<"up" | "down" | "stable">("stable");
  const [prevRate, setPrevRate] = useState<number>(0);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [activePair, setActivePair] = useState<string | null>("USD → AOA");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRateHistory, setShowRateHistory] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        throw new Error("Resposta inválida do motor de cálculo");
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
      setConversionError("Não foi possível processar a cotação. Tenta novamente.");
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
      if (val > 500000) {
        setAmountError("Montante elevado. O processamento poderá requerer validação adicional.");
      } else {
        setAmountError(null);
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d+]/g, "");
    if (val.length > 15) val = val.slice(0, 15);
    setClientPhone(val);
  };

  const handleSwap = () => {
    setIsFlipped(true);
    setTimeout(() => {
      const temp = fromCurr;
      setFromCurr(toCurr);
      setToCurr(temp);
      setActivePair(null);
      setIsFlipped(false);
    }, 300);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(formatCurrency(result) + " " + toCurr);
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleSelectPair = (pair: typeof POPULAR_PAIRS[0]) => {
    setActivePair(pair.label);
    setFromCurr(pair.from);
    setToCurr(pair.to);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1000);
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchConversion().then(() => {
      setTimeout(() => setIsRefreshing(false), 800);
    });
  };

  const handleFinalizarVenda = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || !clientPhone.trim()) {
      alert("Por favor, insere o teu nome e o teu contacto.");
      return;
    }

    if (!isValidAngolanPhone(clientPhone)) {
      alert("Por favor, insere um número de telefone válido (ex: 9XX XXX XXX).");
      return;
    }

    if (!clientBank.trim() || !clientIban.trim()) {
      alert("Por favor, preenche os teus dados bancários para receber o Kwanza.");
      return;
    }

    if (amount <= 0) {
      alert("O valor a vender deve ser superior a zero.");
      return;
    }

    setIsSubmitting(true);

    const mensagem =
      `🚀 *SOLICITAÇÃO DE VENDA DE MOEDA (NEXUS)*\n\n` +
      `👤 *CLIENTE:*\n` +
      `• Nome: ${clientName.trim()}\n` +
      `• Contacto: ${clientPhone.trim()}\n\n` +
      `🏦 *DADOS DE RECEBIMENTO (AOA):*\n` +
      `• Banco: ${clientBank.trim().toUpperCase()}\n` +
      `• IBAN: ${clientIban.trim().toUpperCase()}\n\n` +
      `💵 *DADOS DA OPERAÇÃO:*\n` +
      `• Tu Entregas: ${formatCurrency(amount)} ${fromCurr}\n` +
      `• Recebes em Conta (Estimado): ${formatCurrency(result)} ${toCurr}\n` +
      `• Taxa Aplicada: 1 ${fromCurr} = ${formatRate(currentRate)} ${toCurr}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank", "noopener,noreferrer");

    setTimeout(() => setIsSubmitting(false), 1000);
  };

  return (
    <div className="min-h-screen w-full bg-amber-50 font-sans text-slate-900 antialiased pb-24 selection:bg-amber-200 selection:text-[#1a4571]">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-400/20 animate-pulse" />
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}

      {/* HEADER */}
      <header className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between border-b-2 border-amber-200 sticky top-0 bg-amber-50/95 backdrop-blur z-50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/services")}
            className="rounded-full hover:bg-amber-200 transition-all duration-300 hover:scale-110"
            aria-label="Voltar"
          >
            <ArrowLeft size={22} className="text-[#1a4571]" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center shadow-lg">
              <ArrowRightLeft size={18} className="text-[#1a4571]" />
            </div>
            <span className="text-sm font-bold text-[#1a4571] tracking-wider uppercase">
              Nexus Venda
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-500 ${
              isRefreshing ? "bg-amber-400 text-[#1a4571]" : "bg-white text-slate-600 hover:bg-amber-100"
            }`}
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1a4571] bg-amber-400 px-3 py-1.5 rounded-full shadow-md">
            <ShieldCheck size={16} />
            <span>Liquidação Garantida</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLUNA ESQUERDA: FORMULÁRIO */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-amber-400 px-4 py-1.5 rounded-full text-xs font-black text-[#1a4571] shadow-md">
              <Star size={14} fill="currentColor" />
              <span>Taxas em tempo real</span>
            </div>
            <h1 className="text-4xl font-black text-[#1a4571] tracking-tight leading-tight">
              Liquide o seu saldo internacional
            </h1>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Venda o seu saldo (USD, EUR, USDT) e receba Kwanzas de forma rápida e segura na sua conta bancária local.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border-2 border-amber-200 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown size={16} className="text-amber-500" />
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Pares Populares</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_PAIRS.map((pair) => (
                <PopularPairChip
                  key={pair.label}
                  pair={pair}
                  isActive={activePair === pair.label}
                  onClick={() => handleSelectPair(pair)}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleFinalizarVenda} id="sell-form" className="bg-white p-6 rounded-2xl border-2 border-amber-200 shadow-lg space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={18} className="text-amber-500" />
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Dados do Vendedor
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
                className="bg-amber-50 h-14 rounded-xl border-2 border-amber-200 focus-visible:ring-4 focus-visible:ring-amber-300 focus-visible:border-amber-400 transition-all duration-300 text-base font-bold placeholder:font-normal"
              />
              {clientName.trim().length > 2 && (
                <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 animate-in fade-in" />
              )}
            </div>

            <div className="relative group">
              <label htmlFor="client-phone" className="sr-only">Contacto telefónico</label>
              <Input
                id="client-phone"
                type="tel"
                required
                placeholder="Contacto telefónico (ex: 9XX XXX XXX)"
                value={clientPhone}
                onChange={handlePhoneChange}
                className="bg-amber-50 h-14 rounded-xl border-2 border-amber-200 focus-visible:ring-4 focus-visible:ring-amber-300 focus-visible:border-amber-400 transition-all duration-300 text-base font-bold placeholder:font-normal"
              />
              {isValidAngolanPhone(clientPhone) && (
                <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 animate-in fade-in" />
              )}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t-2 border-amber-100 mb-2">
              <Landmark size={18} className="text-amber-500" />
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Conta para Recebimento
              </span>
            </div>

            <div className="relative group">
              <label htmlFor="client-bank" className="sr-only">Nome do Banco</label>
              <Input
                id="client-bank"
                type="text"
                required
                placeholder="Nome do Banco (ex: BAI, BFA, BIC)"
                value={clientBank}
                onChange={(e) => setClientBank(e.target.value)}
                className="bg-amber-50 h-14 rounded-xl border-2 border-amber-200 focus-visible:ring-4 focus-visible:ring-amber-300 focus-visible:border-amber-400 transition-all duration-300 text-base font-bold placeholder:font-normal"
              />
              {clientBank.trim().length > 1 && (
                <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 animate-in fade-in" />
              )}
            </div>

            <div className="relative group">
              <label htmlFor="client-iban" className="sr-only">IBAN da conta</label>
              <Input
                id="client-iban"
                type="text"
                required
                placeholder="IBAN da sua conta"
                value={clientIban}
                onChange={(e) => setClientIban(e.target.value)}
                className="bg-amber-50 h-14 rounded-xl border-2 border-amber-200 focus-visible:ring-4 focus-visible:ring-amber-300 focus-visible:border-amber-400 transition-all duration-300 text-base font-bold placeholder:font-normal uppercase"
              />
              {clientIban.trim().length > 10 && (
                <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 animate-in fade-in" />
              )}
            </div>

            <div className="bg-amber-100 rounded-xl p-3 flex items-start gap-2 border border-amber-200">
              <Info size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                Os dados são enviados diretamente via WhatsApp. Não guardamos informações pessoais no servidor.
              </p>
            </div>
          </form>
        </div>

        {/* COLUNA DIREITA: SIMULADOR */}
        <div className="lg:col-span-7 w-full">
          <div className="bg-white rounded-[2rem] border-4 border-amber-400 shadow-2xl p-6 space-y-6 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-200 rounded-full opacity-50 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-300 rounded-full opacity-30 blur-3xl" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center shadow-lg">
                  <ArrowRightLeft size={20} className="text-[#1a4571]" />
                </div>
                <div className="text-left">
                  <h2 className="text-lg font-black text-[#1a4571]">Câmbio</h2>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock size={12} />
                    Atualizado às {lastUpdated.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSwap}
                className={`p-3 rounded-xl bg-amber-100 hover:bg-amber-200 transition-all duration-300 hover:scale-110 active:scale-95 shadow-md ${isFlipped ? "rotate-180" : ""}`}
                title="Inverter moedas"
              >
                <ArrowRightLeft size={18} className="text-[#1a4571]" />
              </button>
            </div>

            {/* Caixa: Valor de Entrega */}
            <div className={`bg-amber-50 rounded-2xl p-5 border-2 border-amber-200 flex items-center justify-between transition-all duration-300 ${inputFocused ? "ring-4 ring-amber-300 border-amber-400 shadow-lg" : "shadow-md"}`}>
              <div className="flex flex-col text-left w-full">
                <label htmlFor="sell-amount" className="text-xs font-black text-amber-600 uppercase tracking-wider flex items-center gap-1">
                  <TrendingDown size={14} />
                  Tu entregas (Saldo externo)
                </label>
                <input
                  id="sell-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={handleAmountChange}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="bg-transparent text-3xl font-black text-[#1a4571] outline-none w-full mt-2 placeholder:text-amber-300"
                />
                {amountError && (
                  <span className="text-xs text-red-500 font-bold mt-1 animate-pulse">{amountError}</span>
                )}
              </div>
              <CurrencySelect
                value={fromCurr}
                onChange={setFromCurr}
                label="Moeda de entrega"
              />
            </div>

            {/* Fluxo Intermédio */}
            <div className="relative pl-8 space-y-3 border-l-4 border-dashed border-amber-300 ml-4 text-left">
              <div className="flex items-center gap-3 text-slate-700 font-bold bg-amber-100 py-3 px-4 rounded-xl border-2 border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <span className="font-black text-[#1a4571] text-sm">Cotação:</span>
                <span className="font-mono font-black text-[#1a4571] text-sm">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw size={14} className="animate-spin" />
                      A calcular...
                    </span>
                  ) : (
                    `1 ${fromCurr} = ${formatRate(currentRate)} ${toCurr}`
                  )}
                </span>
                {!isLoading && rateTrend !== "stable" && (
                  <span className={`flex items-center gap-1 text-xs font-black ${rateTrend === "up" ? "text-emerald-600" : "text-red-500"}`}>
                    {rateTrend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {rateTrend === "up" ? "Subiu" : "Desceu"}
                  </span>
                )}
              </div>

              {conversionError && (
                <div className="text-red-600 text-xs font-bold bg-red-50 py-3 px-4 rounded-xl border-2 border-red-200 flex items-center gap-2 animate-pulse">
                  <AlertCircle size={16} />
                  {conversionError}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowRateHistory(!showRateHistory)}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors"
              >
                <TrendingUp size={12} />
                {showRateHistory ? "Ocultar detalhes" : "Ver detalhes da taxa"}
              </button>

              {showRateHistory && (
                <div className="bg-white rounded-xl p-3 border border-amber-200 text-xs space-y-2 animate-in slide-in-from-top-2">
                  <div className="flex justify-between font-bold text-slate-600">
                    <span>Taxa de liquidação:</span>
                    <span className="text-[#1a4571]">{formatRate(currentRate)} {toCurr}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-600">
                    <span>Última atualização:</span>
                    <span>{lastUpdated.toLocaleTimeString("pt-PT")}</span>
                  </div>
                </div>
              )}
            </div>

            {/* CARD PREMIUM: Valor Recebido */}
            <div className="bg-[#1a4571] rounded-2xl p-6 shadow-2xl border-4 border-amber-400 flex items-center justify-between text-left relative group hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a4571] to-[#0f2d4d] rounded-2xl" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-400/5 rounded-full blur-xl pointer-events-none" />

              <div className="relative flex flex-col text-white z-10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                    <TrendingUp size={14} className="text-[#1a4571]" />
                  </div>
                  <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                    Tu recebes estimado
                  </span>
                </div>
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-2 drop-shadow-lg">
                  {isLoading ? (
                    <span className="flex items-center gap-3">
                      <RefreshCw size={28} className="animate-spin text-amber-400" />
                      <span className="text-amber-400">...</span>
                    </span>
                  ) : (
                    <span className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl text-amber-400">{toCurr}</span>
                      {formatCurrency(result)}
                    </span>
                  )}
                </span>
                {!isLoading && result > 0 && (
                  <span className="text-xs text-amber-300/80 font-medium mt-2 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Depósito imediato via IBAN fornecido
                  </span>
                )}
              </div>

              <div className="relative z-10 flex flex-col items-end gap-3">
                <CurrencySelect
                  value={toCurr}
                  onChange={setToCurr}
                  label="Moeda a receber"
                  variant="dark"
                />
                <button
                  type="button"
                  onClick={handleCopyAmount}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg ${
                    copiedAmount
                      ? "bg-emerald-500 text-white"
                      : "bg-amber-400 text-[#1a4571] hover:bg-amber-300"
                  }`}
                  title="Copiar valor"
                >
                  {copiedAmount ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  {copiedAmount ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>

            {/* Botão */}
            <Button
              type="submit"
              form="sell-form"
              disabled={isLoading || isSubmitting || !!conversionError || amount <= 0}
              className="w-full h-16 bg-[#1a4571] hover:bg-[#0f2d4d] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black text-lg rounded-2xl transition-all duration-300 uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-3">
                  <RefreshCw size={20} className="animate-spin" />
                  A PROCESSAR...
                </span>
              ) : (
                <>
                  SOLICITAR VENDA
                  <Send size={20} className="transition-transform" />
                </>
              )}
            </Button>

            {/* Footer do card */}
            <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-500" />
                SSL Seguro
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span className="flex items-center gap-1">
                <Clock size={14} className="text-amber-500" />
                24h/7d
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span className="flex items-center gap-1">
                <Zap size={14} className="text-amber-500" />
                Instantâneo
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sell;