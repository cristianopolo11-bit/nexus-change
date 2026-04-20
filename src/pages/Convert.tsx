import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Upload, CheckCircle2, ArrowLeft, Banknote, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Convert() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { from, to, side } = useParams();

  const fromCurrency = (from || "USD").toUpperCase();
  const toCurrency = (to || "AOA").toUpperCase();
  const operationSide = side?.toLowerCase() || "compra";

  // ESTADOS (Devem vir antes de qualquer 'if')
  const [clientName, setClientName] = useState("");
  const [amount, setAmount] = useState("100");
  const [whatsapp, setWhatsapp] = useState("");
  const [payoutIban, setPayoutIban] = useState(""); 
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const NEXUS_RATES: Record<string, number> = {
    "USD_AOA": 1150, "AOA_USD": 1 / 1250,
    "EUR_AOA": 1300, "AOA_EUR": 1 / 1400,
    "USD_EUR": 0.92, "EUR_USD": 1.08,
  };

  const currentPair = `${fromCurrency}_${toCurrency}`;
  const rate = NEXUS_RATES[currentPair] || 1;
  const result = useMemo(() => (parseFloat(amount) || 0) * rate, [amount, rate]);

  const dynamicContent = useMemo(() => {
    const isVenda = operationSide === "venda";
    return {
      type: isVenda ? "VENDA" : "COMPRA",
      instructionTitle: `Enviar ${fromCurrency}`,
      instructionText: isVenda 
        ? `Estás a vender ${fromCurrency}. Transfere para os nossos dados:` 
        : `Para comprares ${toCurrency}, envia os ${fromCurrency} para:`,
      account: fromCurrency === "AOA" 
        ? "AO06 0055 0000 1234 5678 9 (BAI - Nexus)" 
        : "nexus.global@wise.com (Zelle / Wise)",
      payoutLabel: `Dados para receberes teus ${toCurrency}`,
      payoutPlaceholder: `E-mail Wise, IBAN ou Wallet`,
      color: isVenda ? "text-blue-600" : "text-green-600",
      bgColor: isVenda ? "bg-blue-500/10" : "bg-green-500/10"
    };
  }, [fromCurrency, toCurrency, operationSide]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!", description: "Dados prontos para colar." });
  };

  const handleFinalize = async () => {
    if (!amount || !whatsapp || !payoutIban || !file || !clientName) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${whatsapp}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('receipts').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('receipts').getPublicUrl(fileName);
      
      const { error: orderError } = await supabase.from('orders').insert([{
        client_name: clientName,
        client_whatsapp: whatsapp,
        client_iban: payoutIban,
        amount_sent: `${amount} ${fromCurrency}`,
        amount_to_receive: `${result.toFixed(2)} ${toCurrency}`,
        client_receipt_url: publicUrl,
        status: 'Pendente'
      }]);

      if (orderError) throw orderError;
      setIsSuccess(true);
    } catch (error: any) {
      alert("Erro: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // TELA DE SUCESSO (Agora dentro da função, após os estados serem definidos)
  if (isSuccess) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-6 text-center">
        <div className="w-full max-w-md space-y-6 bg-card p-10 rounded-[3rem] border border-foreground/5 shadow-2xl">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">Ordem Registada!</h2>
          <div className="flex flex-col gap-3 pt-4">
            <button onClick={() => navigate("/orders")} className="w-full py-4 bg-primary text-white rounded-2xl font-bold">Ver Minhas Ordens</button>
            <button onClick={() => navigate("/")} className="w-full py-4 bg-foreground/5 text-foreground rounded-2xl font-bold">Início</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-start font-sans overflow-x-hidden">
      <div className="w-full max-w-lg px-4 flex flex-col items-center mx-auto">
        
        <header className="flex items-center gap-4 py-8 w-full">
          <button onClick={() => navigate("/")} className="p-3 bg-foreground/5 rounded-full hover:bg-foreground/10 transition-all">
            <ArrowLeft size={20}/>
          </button>
          <h1 className="text-xl font-black uppercase italic tracking-tighter text-primary">Nexus Checkout</h1>
        </header>

        <div className="w-full bg-card rounded-[2.5rem] p-6 sm:p-8 border border-foreground/5 shadow-xl space-y-8 mb-10">
          
          <div className="flex justify-between items-end border-b border-foreground/5 pb-6">
            <div>
              <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${dynamicContent.bgColor} ${dynamicContent.color}`}>
                {dynamicContent.type}
              </span>
              <div className="text-2xl font-black italic mt-2 tracking-tighter">{fromCurrency} → {toCurrency}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-foreground/30 block italic">Taxa Nexus</span>
              <span className="font-bold text-sm">1 {fromCurrency} = {rate.toLocaleString()} {toCurrency}</span>
            </div>
          </div>

          <div className="space-y-4 w-full text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-foreground/40 ml-1 tracking-widest">Valor a enviar ({fromCurrency})</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full h-16 bg-foreground/[0.03] rounded-2xl px-6 text-2xl font-black outline-none border border-transparent focus:border-primary/20" />
            </div>
            <div className="py-4 bg-primary/[0.02] rounded-2xl border border-primary/5 text-center">
              <span className="text-[10px] font-black uppercase text-primary tracking-widest italic">Vais receber: {result.toLocaleString()} {toCurrency}</span>
            </div>
          </div>

          <div className="space-y-4 w-full">
            <input placeholder="Teu Nome Completo" className="w-full h-14 bg-foreground/5 rounded-xl px-4 font-bold outline-none border border-transparent focus:border-primary/10" value={clientName} onChange={(e) => setClientName(e.target.value)} />
            <input placeholder="Teu WhatsApp" className="w-full h-14 bg-foreground/5 rounded-xl px-4 font-bold outline-none border border-transparent focus:border-primary/10" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
            
            <div className="space-y-1 text-left">
              <label className={`text-[9px] font-black uppercase ml-1 italic tracking-widest ${dynamicContent.color}`}>
                {dynamicContent.payoutLabel}
              </label>
              <textarea placeholder={dynamicContent.payoutPlaceholder} className="w-full h-20 bg-foreground/5 rounded-xl p-4 font-bold outline-none border border-transparent focus:border-primary/10 resize-none" value={payoutIban} onChange={(e) => setPayoutIban(e.target.value)} />
            </div>
          </div>

          <div className={`p-6 rounded-[2.5rem] border border-foreground/5 space-y-4 ${dynamicContent.bgColor}`}>
            <div className="flex items-center gap-2">
              <Banknote size={16} className={dynamicContent.color} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${dynamicContent.color}`}>{dynamicContent.instructionTitle}</span>
            </div>
            <p className="text-[11px] font-bold text-foreground/70 leading-relaxed text-left">{dynamicContent.instructionText}</p>
            <div 
              onClick={() => copyToClipboard(dynamicContent.account)}
              className="bg-background/80 p-5 rounded-2xl border border-foreground/5 font-mono text-[11px] font-black text-center cursor-pointer hover:bg-background transition-all flex flex-col items-center justify-center gap-2 group shadow-inner"
            >
              <span className="text-[8px] text-foreground/30 uppercase tracking-tighter italic">Clica para copiar dados Nexus</span>
              <span className="break-all text-primary">{dynamicContent.account}</span>
              <Copy size={14} className="opacity-20 group-hover:opacity-100 transition-opacity text-primary" />
            </div>
          </div>

          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-foreground/10 rounded-[2rem] cursor-pointer hover:bg-foreground/5 transition-all group">
            <Upload className="w-5 h-5 text-foreground/20 group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-black uppercase mt-1 text-foreground/40 tracking-widest">{file ? file.name : "Anexar Comprovativo"}</span>
            <input type="file" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
          </label>

          <button onClick={handleFinalize} disabled={loading} className="w-full py-6 bg-primary text-white rounded-3xl font-black uppercase italic shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50">
            {loading ? "A processar..." : `Confirmar ${dynamicContent.type}`}
          </button>
        </div>
      </div>
    </div>
  );
}