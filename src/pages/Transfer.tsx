import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { convert, getExchangeRate } from "@/lib/currencies";
import { ArrowLeft, Send, ShieldCheck, User, Users, RefreshCw } from "lucide-react";

const Transfer = () => {
  const navigate = useNavigate();

  // --- ESTADOS DO FORMULÁRIO ---
  // Ordenante
  const [senderName, setSenderName] = useState("");
  const [senderCountry, setSenderCountry] = useState("Angola");
  const [senderMethod, setSenderMethod] = useState("Banco");

  // Beneficiário
  const [receiverName, setReceiverName] = useState("");
  const [receiverCountry, setReceiverCountry] = useState("Angola");
  const [receiverMethod, setReceiverMethod] = useState("Banco");

  // Conversor e Valores
  const [amount, setAmount] = useState<number>(100);
  const [result, setResult] = useState<number>(0);
  const [currentRate, setCurrentRate] = useState<number>(0);
  const [fromCurr, setFromCurr] = useState("USD");
  const [toCurr, setToCurr] = useState("AOA");

  // --- LISTAS CONFIGURADAS ---
  // Países em Ordem Alfabética
  const countries = [
    "Angola",
    "Bélgica",
    "Bulgária",
    "Camarões",
    "Congo BR",
    "Congo RDC",
    "França",
    "Portugal"
  ];

  // Moedas Disponíveis
  const currencies = ["USD", "EUR", "AOA", "USDT"];

  // Métodos de Movimentação
  const methods = ["Banco", "Carteira Digital"];

  // --- LÓGICA DE CONVERSÃO (API / FALLBACK) ---
  useEffect(() => {
    const updateConversion = async () => {
      try {
        const rateValue = await convert(1, fromCurr, toCurr, false);
        const finalRate = rateValue && rateValue > 0 
          ? rateValue 
          : getExchangeRate(fromCurr, toCurr, false);
        
        setCurrentRate(finalRate);
        setResult(amount * finalRate);
      } catch (error) {
        console.error("Erro na conversão de transferência:", error);
        const fallbackRate = getExchangeRate(fromCurr, toCurr, false);
        setCurrentRate(fallbackRate);
        setResult(amount * fallbackRate);
      }
    };
    updateConversion();
  }, [amount, fromCurr, toCurr]);

  // --- ENVIO DOS DADOS PARA O WHATSAPP ---
  const handleFinalizarTransferencia = (e: React.FormEvent) => {
    e.preventDefault();

    if (!senderName || !receiverName || amount <= 0) {
      alert("Por favor, preencha os nomes do ordenante, do beneficiário e o valor.");
      return;
    }

    // Link direto para o teu operador
    const numeroWhatsapp = "244928669514"; 
    
    const totalFormatado = result.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const quantiaFormatada = amount.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const mensagem = `🚀 *NOVA SOLICITAÇÃO DE TRANSFERÊNCIA*\n\n` +
                     `👤 *ORDENANTE (QUEM ENVIA):*\n` +
                     `• Nome: ${senderName}\n` +
                     `• País atual: ${senderCountry}\n` +
                     `• Método de envio: ${senderMethod}\n\n` +
                     `🎯 *BENEFICIÁRIO (QUEM RECEBE):*\n` +
                     `• Nome: ${receiverName}\n` +
                     `• País destino: ${receiverCountry}\n` +
                     `• Método de receção: ${receiverMethod}\n\n` +
                     `💵 *DADOS FINANCEIROS (SIMULAÇÃO):*\n` +
                     `• Envia: ${quantiaFormatada} ${fromCurr}\n` +
                     `• Destino: ${totalFormatado} ${toCurr}\n` +
                     `• Taxa aplicada: 1 ${fromCurr} = ${currentRate} ${toCurr}\n\n` +
                     `Gostaria de receber os dados de liquidação para prosseguir.`;

    const urlWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsapp, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 pb-20 font-sans text-left animate-in fade-in duration-500">
      <header className="p-6 flex items-center gap-4 bg-white border-b sticky top-0 z-50">
        <Button variant="ghost" size="icon" onClick={() => navigate("/services")} className="rounded-full">
          <ArrowLeft size={20} className="text-[#1a4571]" />
        </Button>
        <h1 className="text-xl font-black text-[#1a4571] uppercase italic tracking-tighter">Transferências Internacionais</h1>
      </header>

      <div className="max-w-3xl mx-auto px-4 mt-8">
        <form onSubmit={handleFinalizarTransferencia} className="space-y-6">
          
          {/* SECÇÃO 1: ORDENANTE */}
          <Card className="p-6 md:p-8 bg-white border border-slate-100 shadow-sm rounded-[2rem] space-y-4">
            <div className="flex items-center gap-2 text-[#1a4571] border-b pb-3 border-slate-100">
              <User size={20} />
              <h2 className="text-lg font-black uppercase italic">1. Dados do Ordenante (Quem Envia)</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Nome Completo</label>
                <Input 
                  type="text" 
                  required
                  placeholder="Ex: Cristiano Polo"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="h-12 border-slate-200 focus:border-[#1a4571] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">País onde se encontra</label>
                  <select 
                    value={senderCountry}
                    onChange={(e) => setSenderCountry(e.target.value)}
                    className="w-full h-12 bg-white border border-slate-200 rounded-xl px-3 font-medium text-sm text-slate-700 focus:border-[#1a4571] outline-none"
                  >
                    {countries.map((c) => (
                      <option key={c} value={c} className="notranslate" translate="no">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Método de Envio</label>
                  <select 
                    value={senderMethod}
                    onChange={(e) => setSenderMethod(e.target.value)}
                    className="w-full h-12 bg-white border border-slate-200 rounded-xl px-3 font-medium text-sm text-slate-700 focus:border-[#1a4571] outline-none"
                  >
                    {methods.map((m) => (
                      <option key={m} value={m} className="notranslate" translate="no">{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* SECÇÃO 2: BENEFICIÁRIO */}
          <Card className="p-6 md:p-8 bg-white border border-slate-100 shadow-sm rounded-[2rem] space-y-4">
            <div className="flex items-center gap-2 text-[#1a4571] border-b pb-3 border-slate-100">
              <Users size={20} />
              <h2 className="text-lg font-black uppercase italic">2. Dados do Beneficiário (Quem Recebe)</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Nome do Beneficiário</label>
                <Input 
                  type="text" 
                  required
                  placeholder="Ex: Hamilton Silva"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="h-12 border-slate-200 focus:border-[#1a4571] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">País de Destino</label>
                  <select 
                    value={receiverCountry}
                    onChange={(e) => setReceiverCountry(e.target.value)}
                    className="w-full h-12 bg-white border border-slate-200 rounded-xl px-3 font-medium text-sm text-slate-700 focus:border-[#1a4571] outline-none"
                  >
                    {countries.map((c) => (
                      <option key={c} value={c} className="notranslate" translate="no">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Método de Recebimento</label>
                  <select 
                    value={receiverMethod}
                    onChange={(e) => setReceiverMethod(e.target.value)}
                    className="w-full h-12 bg-white border border-slate-200 rounded-xl px-3 font-medium text-sm text-slate-700 focus:border-[#1a4571] outline-none"
                  >
                    {methods.map((m) => (
                      <option key={m} value={m} className="notranslate" translate="no">{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* SECÇÃO 3: VALORES E CONVERSOR INTELIGENTE */}
          <Card className="p-6 md:p-8 bg-white border border-slate-100 shadow-xl rounded-[2rem] space-y-6">
            <div className="flex items-center gap-2 text-[#1a4571] border-b pb-3 border-slate-100">
              <RefreshCw size={20} />
              <h2 className="text-lg font-black uppercase italic">3. Simulação de Câmbio</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 block mb-1">Valor a Enviar</label>
                  <Input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="h-14 text-xl font-black border-slate-200 focus:border-[#1a4571] rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Moeda Envio</label>
                    <select 
                      value={fromCurr}
                      onChange={(e) => setFromCurr(e.target.value)}
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-3 font-black text-sm text-slate-700 outline-none"
                    >
                      {currencies.map((curr) => (
                        <option key={curr} value={curr} className="notranslate" translate="no">{curr}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Moeda Destino</label>
                    <select 
                      value={toCurr}
                      onChange={(e) => setToCurr(e.target.value)}
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-3 font-black text-sm text-slate-700 outline-none"
                    >
                      {currencies.map((curr) => (
                        <option key={curr} value={curr} className="notranslate" translate="no">{curr}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Resultado Visual do Câmbio */}
              <div className="bg-[#1a4571] text-white p-6 rounded-2xl flex flex-col justify-between min-h-[140px]">
                <div>
                  <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest block mb-1">Total estimado a receber</span>
                  <div className="text-3xl font-black tracking-tight">
                    {result.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-lg font-bold text-blue-300 notranslate" translate="no">{toCurr}</span>
                  </div>
                </div>
                <div className="text-[11px] text-blue-200 font-medium border-t border-blue-800/60 pt-2 flex justify-between">
                  <span className="notranslate" translate="no">Taxa: 1 {fromCurr} = {currentRate} {toCurr}</span>
                  <ShieldCheck size={14} className="text-emerald-400" />
                </div>
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full h-16 bg-green-600 hover:bg-green-700 text-white font-black text-lg rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 group"
            >
              COMPLETO VÍA WHATSAPP
              <Send size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>

        </form>
      </div>
    </div>
  );
};

export default Transfer;