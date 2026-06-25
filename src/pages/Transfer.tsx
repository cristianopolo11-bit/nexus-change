import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { convert, getExchangeRate } from "@/lib/currencies";
import { ArrowLeft, Send, ShieldCheck, Info, HelpCircle, ChevronDown, Landmark, User, Globe, Wallet, RefreshCw, TrendingUp, TrendingDown, Clock, ArrowRightLeft, CheckCircle2, AlertCircle } from "lucide-react";

// ─── DADOS ESTÁTICOS ────────────────────────────────────────────────
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  "África do Sul": "ZAR",
  "Angola": "AOA",
  "Bélgica": "EUR",
  "Bulgária": "BGN",
  "Camarões": "XAF",
  "Congo Brazzaville": "XAF",
  "Congo RDC": "CDF",
  "França": "EUR",
  "Moçambique": "MZN",
  "Portugal": "EUR",
};

const COUNTRY_FLAGS: Record<string, string> = {
  "África do Sul": "🇿🇦",
  "Angola": "🇦🇴",
  "Bélgica": "🇧🇪",
  "Bulgária": "🇧🇬",
  "Camarões": "🇨🇲",
  "Congo Brazzaville": "🇨🇬",
  "Congo RDC": "🇨🇩",
  "França": "🇫🇷",
  "Moçambique": "🇲🇿",
  "Portugal": "🇵🇹",
};

const COUNTRIES = Object.keys(COUNTRY_TO_CURRENCY).sort((a, b) =>
  a.localeCompare(b, "pt-PT")
);

const METHODS = ["Banco", "Carteira Digital"];
const WHATSAPP_NUMBER = "244928669514";

// ─── UTILITÁRIOS ────────────────────────────────────────────────────
const formatCurrency = (value: number, digits = 2) =>
  value.toLocaleString("pt-PT", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

const formatRate = (value: number) =>
  value.toLocaleString("pt-PT", { maximumFractionDigits: 5 });

// ─── COMPONENTE: DROPDOWN DE PAÍS COM BANDEIRA ────────────────────
interface CountrySelectProps {
  value: string;
  onChange: (country: string) => void;
  label: string;
}

const CountrySelect = ({ value, onChange, label }: CountrySelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full text-left">
      <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-13 bg-white border-2 border-amber-200 rounded-xl px-3 flex items-center justify-between font-bold text-sm text-slate-700 outline-none focus:border-amber-400 transition-all shadow-sm hover:bg-amber-50/30"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none">{COUNTRY_FLAGS[value]}</span>
          <span>{value}</span>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border-2 border-amber-200 rounded-xl shadow-2xl max-h-56 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {COUNTRIES.map((country) => (
            <button
              key={country}
              type="button"
              onClick={() => { onChange(country); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-bold transition-colors ${
                country === value ? "bg-amber-400 text-[#1a4571]" : "text-slate-700 hover:bg-amber-50"
              }`}
            >
              <span className="text-lg leading-none">{COUNTRY_FLAGS[country]}</span>
              <span>{country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── COMPONENTE: DROPDOWN DE MÉTODO ───────────────────────────────
interface MethodSelectProps {
  value: string;
  onChange: (method: string) => void;
  label: string;
}

const MethodSelect = ({ value, onChange, label }: MethodSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full text-left">
      <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-13 bg-white border-2 border-amber-200 rounded-xl px-3 flex items-center justify-between font-bold text-sm text-slate-700 outline-none focus:border-amber-400 transition-all shadow-sm hover:bg-amber-50/30"
      >
        <span>{value}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border-2 border-amber-200 rounded-xl shadow-xl overflow-hidden">
          {METHODS.map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => { onChange(method); setOpen(false); }}
              className={`w-full flex items-center px-4 py-3 text-sm font-bold transition-colors ${
                method === value ? "bg-amber-400 text-[#1a4571]" : "text-slate-700 hover:bg-amber-50"
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── COMPONENTE PRINCIPAL ───────────────────────────────────────────
const Transfer = () => {
  const navigate = useNavigate();

  const [senderName, setSenderName] = useState("");
  const [senderCountry, setSenderCountry] = useState("Angola");
  const [senderMethod, setSenderMethod] = useState("Banco");

  const [receiverName, setReceiverName] = useState("");
  const [receiverCountry, setReceiverCountry] = useState("Portugal");
  const [receiverMethod, setReceiverMethod] = useState("Banco");

  const [amount, setAmount] = useState<number>(1000);
  const [result, setResult] = useState<number>(0);
  const [currentRate, setCurrentRate] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [inputFocused, setInputFocused] = useState(false);

  const fromCurr = COUNTRY_TO_CURRENCY[senderCountry] ?? "AOA";
  const toCurr = COUNTRY_TO_CURRENCY[receiverCountry] ?? "EUR";

  const fetchConversion = useCallback(async () => {
    if (amount <= 0) { setResult(0); setCurrentRate(0); setConversionError(null); return; }
    if (fromCurr === toCurr) { setCurrentRate(1); setResult(amount); setConversionError(null); return; }

    setIsLoading(true);
    setConversionError(null);

    try {
      let rateValue = await convert(1, fromCurr, toCurr, false);
      if (!rateValue || typeof rateValue !== "number" || rateValue <= 0) {
        rateValue = getExchangeRate(fromCurr, toCurr, false) ?? 1;
      }
      setCurrentRate(rateValue);
      setResult(amount * rateValue);
    } catch (error) {
      console.error("Erro no motor de conversão:", error);
      setConversionError("Não foi possível obter a taxa de câmbio atual.");
      const fallbackRate = getExchangeRate(fromCurr, toCurr, false) ?? 1;
      setCurrentRate(fallbackRate);
      setResult(amount * fallbackRate);
    } finally {
      setIsLoading(false);
    }
  }, [amount, fromCurr, toCurr]);

  useEffect(() => {
    fetchConversion();
  }, [fetchConversion]);

  const handleFinalizarTransferencia = (e: React.FormEvent) => {
    e.preventDefault();

    if (!senderName.trim() || !receiverName.trim()) {
      alert("Por favor, preencha os nomes do ordenante e do beneficiário.");
      return;
    }

    if (amount <= 0) {
      alert("O valor a transferir deve ser superior a zero.");
      return;
    }

    const mensagem =
      `🚀 *SOLICITAÇÃO DE TRANSFERÊNCIA INTERNACIONAL*\n\n` +
      `👤 *ORDENANTE (QUEM ENVIA):*\n` +
      `• Nome: ${senderName.trim()}\n` +
      `• País atual: ${senderCountry} ${COUNTRY_FLAGS[senderCountry]}\n` +
      `• Método de envio: ${senderMethod}\n\n` +
      `🎯 *BENEFICIÁRIO (QUEM RECEBE):*\n` +
      `• Nome: ${receiverName.trim()}\n` +
      `• País destino: ${receiverCountry} ${COUNTRY_FLAGS[receiverCountry]}\n` +
      `• Método de receção: ${receiverMethod}\n\n` +
      `💵 *DADOS FINANCEIROS (SIMULAÇÃO):*\n` +
      `• Envia: ${formatCurrency(amount)} ${fromCurr}\n` +
      `• Destino: ${formatCurrency(result)} ${toCurr}\n` +
      `• Taxa aplicada: 1 ${fromCurr} = ${formatRate(currentRate)} ${toCurr}\n\n` +
      `Gostaria de receber os dados de liquidação para prosseguir com a ordem.`;

    const urlWhatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsapp, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen w-full bg-amber-50 font-sans text-slate-900 antialiased pb-24 selection:bg-amber-200 selection:text-[#1a4571]">
      
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
              <Globe size={18} className="text-[#1a4571]" />
            </div>
            <span className="text-sm font-bold text-[#1a4571] tracking-wider uppercase">
              Nexus Remessas
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#1a4571] bg-amber-400 px-3 py-1.5 rounded-full shadow-md">
          <ShieldCheck size={16} />
          <span>Remessa Certificada</span>
        </div>
      </header>

      {/* ANIMAÇÃO DE ENTRADA SUAVE INTEGRADA NO MAIN */}
      <main className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        
        {/* COLUNA ESQUERDA: FORMULÁRIO OPERACIONAL */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-[#1a4571] tracking-tight leading-tight">
              Enviar dinheiro internacionalmente
            </h1>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Transfira de forma direta e sem burocracias externas. O seu canal de envio direto.
            </p>
          </div>

          <form onSubmit={handleFinalizarTransferencia} id="transfer-form" className="space-y-4">
            
            {/* Bloco 1: Ordenante */}
            <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-lg space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-amber-100">
                <User size={16} className="text-amber-500" />
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  1. Quem Envia (Ordenante)
                </span>
              </div>
              <Input
                type="text"
                required
                placeholder="Nome completo do remetente"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="bg-amber-50/60 h-13 rounded-xl border-2 border-amber-200 focus-visible:ring-4 focus-visible:ring-amber-300 font-bold text-base"
              />
              <div className="grid grid-cols-2 gap-3">
                <CountrySelect value={senderCountry} onChange={setSenderCountry} label="País de Origem" />
                <MethodSelect value={senderMethod} onChange={setSenderMethod} label="Método de Envio" />
              </div>
            </div>

            {/* Bloco 2: Beneficiário */}
            <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-lg space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-amber-100">
                <Landmark size={16} className="text-amber-500" />
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  2. Quem Recebe (Beneficiário)
                </span>
              </div>
              <Input
                type="text"
                required
                placeholder="Nome completo do beneficiário"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className="bg-amber-50/60 h-13 rounded-xl border-2 border-amber-200 focus-visible:ring-4 focus-visible:ring-amber-300 font-bold text-base"
              />
              <div className="grid grid-cols-2 gap-3">
                <CountrySelect value={receiverCountry} onChange={setReceiverCountry} label="País de Destino" />
                <MethodSelect value={receiverMethod} onChange={setReceiverMethod} label="Método de Receção" />
              </div>
            </div>
          </form>
        </div>

        {/* COLUNA DIREITA: SIMULADOR PREMIUM REMESSA */}
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
                  <h2 className="text-lg font-black text-[#1a4571]">Simulador de Envio</h2>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock size={12} /> Liquidação segura sem intermediação oculta.
                  </p>
                </div>
              </div>
            </div>

            {/* Caixa: Valor de Envio */}
            <div className={`bg-amber-50 rounded-2xl p-5 border-2 border-amber-200 flex items-center justify-between transition-all duration-300 ${inputFocused ? "ring-4 ring-amber-300 border-amber-400 shadow-lg" : "shadow-md"}`}>
              <div className="flex flex-col text-left w-full">
                <label htmlFor="send-amount" className="text-xs font-black text-amber-600 uppercase tracking-wider flex items-center gap-1">
                  <TrendingDown size={14} /> Tu envias
                </label>
                <input
                  id="send-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => { const val = parseFloat(e.target.value); if (!isNaN(val) && val >= 0) setAmount(val); }}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="bg-transparent text-3xl font-black text-[#1a4571] outline-none w-full mt-2 placeholder:text-amber-300"
                />
              </div>
              <div className="bg-white border-2 border-amber-200 text-[#1a4571] font-black px-4 py-2.5 rounded-xl shadow-md text-lg min-w-[110px] text-center">
                {fromCurr}
              </div>
            </div>

            {/* Fluxo de Taxa */}
            <div className="relative pl-8 space-y-2 border-l-4 border-dashed border-amber-300 ml-4 text-left">
              <div className="flex items-center gap-3 text-slate-700 font-bold bg-amber-100 py-3 px-4 rounded-xl border-2 border-amber-200 shadow-sm">
                <span className="font-black text-[#1a4571] text-xs uppercase tracking-wider">Cotação do canal:</span>
                <span className="font-mono font-black text-[#1a4571] text-sm">
                  {isLoading ? (
                    <span className="flex items-center gap-2"><RefreshCw size={14} className="animate-spin" /> Calculando...</span>
                  ) : (
                    `1 ${fromCurr} = ${formatRate(currentRate)} ${toCurr}`
                  )}
                </span>
              </div>
              {conversionError && (
                <div className="text-red-600 text-xs font-bold bg-red-50 py-2.5 px-4 rounded-xl border-2 border-red-200 flex items-center gap-2 animate-pulse">
                  <AlertCircle size={16} /> {conversionError}
                </div>
              )}
            </div>

            {/* CARD PREMIUM V2: Valor Recebido */}
            <div className="bg-[#1a4571] rounded-2xl p-6 shadow-2xl border-4 border-amber-400 flex items-center justify-between text-left relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a4571] to-[#0f2d4d]" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative flex flex-col text-white z-10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                    <TrendingUp size={14} className="text-[#1a4571]" />
                  </div>
                  <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                    O beneficiário recebe estimado
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
                    <CheckCircle2 size={12} /> Ordem processada com envio prioritário local
                  </span>
                )}
              </div>
              
              <div className="relative z-10 flex flex-col items-end">
                <div className="bg-amber-400 border-2 border-amber-500 text-[#1a4571] font-black px-4 py-2.5 rounded-xl shadow-md text-lg min-w-[110px] text-center">
                  {toCurr}
                </div>
              </div>
            </div>

            {/* Botão de Submissão */}
            <Button
              type="submit"
              form="transfer-form"
              disabled={isLoading || !!conversionError || amount <= 0}
              className="w-full h-16 bg-[#1a4571] hover:bg-[#0f2d4d] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black text-lg rounded-2xl transition-all duration-300 uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="flex items-center gap-3"><RefreshCw size={20} className="animate-spin" /> PROCESSANDO...</span>
              ) : (
                <> SOLICITAR TRANSFERÊNCIA <Send size={20} /> </>
              )}
            </Button>

            {/* Footer de Garantias */}
            <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-500 pt-2">
              <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-500" /> Remessa Segura</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span className="flex items-center gap-1"><Clock size={14} className="text-amber-500" /> Liquidação Direta</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Transfer;