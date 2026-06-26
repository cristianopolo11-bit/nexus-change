import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { convert, getExchangeRate } from "@/lib/currencies";
import { ArrowLeft, Send, ShieldCheck, Info, HelpCircle, ChevronDown, Landmark, User, Globe, Wallet, RefreshCw, TrendingUp, TrendingDown, Clock, ArrowRightLeft, CheckCircle2, AlertCircle, Mail } from "lucide-react";

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

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

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
        className="w-full h-12 bg-white border-2 border-amber-200 rounded-xl px-3 flex items-center justify-between font-bold text-xs sm:text-sm text-slate-700 outline-none focus:border-amber-400 transition-all shadow-sm hover:bg-amber-50/30"
      >
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-base leading-none shrink-0">{COUNTRY_FLAGS[value]}</span>
          <span className="truncate">{value}</span>
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-[110] mt-1.5 w-full bg-white border-2 border-amber-200 rounded-xl shadow-2xl max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {COUNTRIES.map((country) => (
            <button
              key={country}
              type="button"
              onClick={() => { onChange(country); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs sm:text-sm font-bold transition-colors ${
                country === value ? "bg-amber-400 text-[#1a4571]" : "text-slate-700 hover:bg-amber-50"
              }`}
            >
              <span className="text-base leading-none shrink-0">{COUNTRY_FLAGS[country]}</span>
              <span className="truncate">{country}</span>
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
        className="w-full h-12 bg-white border-2 border-amber-200 rounded-xl px-3 flex items-center justify-between font-bold text-xs sm:text-sm text-slate-700 outline-none focus:border-amber-400 transition-all shadow-sm hover:bg-amber-50/30"
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-[110] mt-1.5 w-full bg-white border-2 border-amber-200 rounded-xl shadow-xl overflow-hidden">
          {METHODS.map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => { onChange(method); setOpen(false); }}
              className={`w-full flex items-center px-4 py-2.5 text-xs sm:text-sm font-bold transition-colors text-left ${
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
  const [senderEmail, setSenderEmail] = useState("");
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
    } fillly {
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

    if (senderEmail.trim() && !isValidEmail(senderEmail)) {
      alert("Por favor, insere um endereço de email válido.");
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
      `• Email: ${senderEmail.trim() ? senderEmail.trim() : "Não informado"}\n` +
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
    <div className="min-h-screen w-full bg-amber-50 font-sans text-slate-900 antialiased pb-12 sm:pb-24 selection:bg-amber-200 selection:text-[#1a4571]">
      
      {/* HEADER ADAPTATIVO */}
      <header className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3 border-b-2 border-amber-200 sticky top-0 bg-amber-50/95 backdrop-blur z-50">
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
              <Globe size={16} className="text-[#1a4571]" />
            </div>
            <span className="text-xs sm:text-sm font-black text-[#1a4571] tracking-wider uppercase whitespace-nowrap">
              Nexus Remessas
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#1a4571] bg-amber-400 px-2.5 py-1.5 rounded-full shadow-md whitespace-nowrap">
          <ShieldCheck size={14} className="shrink-0" />
          <span>Certificada</span>
        </div>
      </header>

      {/* FLUXO FLEXÍVEL PARA SMARTPHONES */}
      <main className="max-w-5xl mx-auto px-4 mt-6 sm:mt-8 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        
        {/* COLUNA ESQUERDA: FORMULÁRIO OPERACIONAL */}
        <div className="w-full lg:w-[42%] space-y-5 sm:space-y-6 text-left">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1a4571] tracking-tight leading-tight">
              Enviar dinheiro internacionalmente
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Envie dinheiro para o mundo todo pagando menos. Transfira o seu dinheiro para onde ele realmente importa, economize em transferências internacionais em mais de 10 moedas.
            </p>
          </div>

          <form onSubmit={handleFinalizarTransferencia} id="transfer-form" className="space-y-4">
            
            {/* Bloco 1: Ordenante */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-amber-200 shadow-lg space-y-3.5">
              <div className="flex items-center gap-2 pb-2 border-b border-amber-100">
                <User size={14} className="text-amber-500 shrink-0" />
                <span className="text-[10px] sm:text-xs font-black uppercase text-slate-500 tracking-wider">
                  1. Quem Envia (Ordenante)
                </span>
              </div>
              
              <div className="space-y-3">
                <Input
                  type="text"
                  required
                  placeholder="Nome completo do remetente"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="bg-amber-50/60 h-12 rounded-xl border-2 border-amber-200 focus-visible:ring-4 focus-visible:ring-amber-300 font-bold text-sm sm:text-base"
                />

                <div className="relative">
                  <Input
                    type="email"
                    required
                    placeholder="Endereço de email do remetente"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="bg-amber-50/60 h-12 rounded-xl border-2 border-amber-200 focus-visible:ring-4 focus-visible:ring-amber-300 font-bold text-sm sm:text-base pr-10"
                  />
                  <Mail size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  {isValidEmail(senderEmail) && (
                    <CheckCircle2 size={16} className="absolute right-9 top-1/2 -translate-y-1/2 text-emerald-500" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CountrySelect value={senderCountry} onChange={setSenderCountry} label="País de Origem" />
                <MethodSelect value={senderMethod} onChange={setSenderMethod} label="Método de Envio" />
              </div>
            </div>

            {/* Bloco 2: Beneficiário */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-amber-200 shadow-lg space-y-3.5">
              <div className="flex items-center gap-2 pb-2 border-b border-amber-100">
                <Landmark size={14} className="text-amber-500 shrink-0" />
                <span className="text-[10px] sm:text-xs font-black uppercase text-slate-500 tracking-wider">
                  2. Quem Recebe (Beneficiário)
                </span>
              </div>
              <Input
                type="text"
                required
                placeholder="Nome completo do beneficiário"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className="bg-amber-50/60 h-12 rounded-xl border-2 border-amber-200 focus-visible:ring-4 focus-visible:ring-amber-300 font-bold text-sm sm:text-base"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CountrySelect value={receiverCountry} onChange={setReceiverCountry} label="País de Destino" />
                <MethodSelect value={receiverMethod} onChange={setReceiverMethod} label="Método de Receção" />
              </div>
            </div>
          </form>
        </div>

        {/* COLUNA DIREITA: SIMULADOR PREMIUM REMESSA */}
        <div className="w-full lg:flex-1">
          <div className="bg-white rounded-[2rem] border-4 border-amber-400 shadow-2xl p-4 sm:p-6 space-y-5 sm:space-y-6 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-200 rounded-full opacity-50 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-300 rounded-full opacity-30 blur-3xl pointer-events-none" />

            <div className="relative flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                  <ArrowRightLeft size={18} className="text-[#1a4571]" />
                </div>
                <div className="text-left">
                  <h2 className="text-base sm:text-lg font-black text-[#1a4571]">Simulador de Envio</h2>
                  <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <Clock size={11} className="shrink-0" />
                    <span>Liquidação sem taxas ocultas.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Caixa: Valor de Envio */}
            <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200 flex items-center justify-between gap-3 shadow-md">
              <div className="flex flex-col text-left w-full min-w-0">
                <label htmlFor="send-amount" className="text-[11px] font-black text-amber-600 uppercase tracking-wider flex items-center gap-1">
                  <TrendingDown size={12} /> Tu envias
                </label>
                <input
                  id="send-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount || ""}
                  onChange={(e) => { const val = parseFloat(e.target.value); if (!isNaN(val) && val >= 0) setAmount(val); }}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="bg-transparent text-2xl sm:text-3xl font-black text-[#1a4571] outline-none w-full mt-1.5 placeholder:text-amber-300 min-w-0"
                  placeholder="0"
                />
              </div>
              <div className="bg-white border-2 border-amber-200 text-[#1a4571] font-black px-3.5 py-2 rounded-xl shadow-md text-sm sm:text-lg shrink-0 min-w-[85px] text-center">
                {fromCurr}
              </div>
            </div>

            {/* Fluxo de Taxa */}
            <div className="relative pl-6 space-y-2 border-l-4 border-dashed border-amber-300 ml-3 text-left">
              <div className="flex flex-wrap items-center gap-2 text-slate-700 font-bold bg-amber-100 py-2.5 px-3 rounded-xl border-2 border-amber-200 shadow-sm text-xs sm:text-sm">
                <span className="font-black text-[#1a4571]">Cotação do canal:</span>
                <span className="font-mono font-black text-[#1a4571]">
                  {isLoading ? (
                    <span className="flex items-center gap-1.5"><RefreshCw size={12} className="animate-spin" /> Calculando...</span>
                  ) : (
                    `1 ${fromCurr} = ${formatRate(currentRate)} ${toCurr}`
                  )}
                </span>
              </div>
              {conversionError && (
                <div className="text-red-600 text-[11px] font-bold bg-red-50 py-2 px-3 rounded-xl border-2 border-red-200 flex items-center gap-1.5 leading-tight">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{conversionError}</span>
                </div>
              )}
            </div>

            {/* CARD PREMIUM V2: Valor Recebido */}
            <div className="bg-[#1a4571] rounded-2xl p-4 sm:p-6 shadow-2xl border-4 border-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a4571] to-[#0f2d4d] rounded-xl" />
              
              <div className="relative flex flex-col text-white z-10 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shrink-0">
                    <TrendingUp size={11} className="text-[#1a4571]" />
                  </div>
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider truncate">
                    O beneficiário recebe estimado
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
                    <span>Ordem com prioridade de rede local</span>
                  </span>
                )}
              </div>
              
              <div className="relative z-10 flex flex-row sm:flex-col items-center sm:items-end justify-end gap-2 pt-2 sm:pt-0 border-t border-white/10 sm:border-none">
                <div className="bg-amber-400 border-2 border-amber-500 text-[#1a4571] font-black px-3.5 py-1.5 h-10 flex items-center justify-center rounded-xl shadow-md text-sm sm:text-lg shrink-0 min-w-[85px] text-center">
                  {toCurr}
                </div>
              </div>
            </div>

            {/* Botão de Submissão */}
            <Button
              type="submit"
              form="transfer-form"
              disabled={isLoading || !!conversionError || amount <= 0}
              className="w-full h-14 sm:h-16 bg-[#1a4571] hover:bg-[#0f2d4d] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base rounded-2xl transition-all duration-300 uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] active:scale-[0.99]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2"><RefreshCw size={16} className="animate-spin" /> PROCESSANDO...</span>
              ) : (
                <>
                  <span>Solicitar Transferência</span>
                  <Send size={16} />
                </>
              )}
            </Button>

            {/* Footer de Garantias */}
            <div className="flex items-center justify-center gap-3 text-[10px] font-bold text-slate-400 pt-1 flex-wrap">
              <span className="flex items-center gap-0.5 text-slate-500"><ShieldCheck size={12} className="text-emerald-500" /> Remessa Segura</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span className="flex items-center gap-0.5 text-slate-500"><Clock size={12} className="text-amber-500" /> Liquidação Direta</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Transfer;