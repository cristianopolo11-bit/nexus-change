import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CurrencySelect from "@/components/CurrencySelect";
import ConversionResult from "@/components/ConversionResult";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { convert, fetchRates, getExchangeRate } from "@/lib/currencies"; 
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  ArrowRight, 
  ShoppingBag, 
  CreditCard, 
  Repeat, 
  ShieldCheck, 
  Menu,
  Wallet,
  HandCoins,
  Headphones,
  LayoutGrid
} from "lucide-react";

// TAXAS OFICIAIS SINCRONIZADAS COM O CHECKOUT (Convert.tsx)
const NEXUS_RATES: Record<string, number> = {
  "USD_AOA": 1200,
  "EUR_AOA": 1350,
  "USDT_AOA": 1200,
  "USDC_AOA": 1200,
  "BRL_AOA": 250,
  "AOA_USD": 1 / 1250, 
};

// COMPONENTE DE CARROSSEL REENGENHARIZADO CONTRA QUEBRAS VISUAIS
const ServiceCarousel = ({ images, title }: { images: string[], title: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500); // 4.5 segundos para dar tempo à cache do browser
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    // bg-[#1a4571] serve de base fixa se tudo falhar, mas as transições controlam o bloco
    <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden rounded-3xl group border border-slate-100 shadow-lg bg-[#1a4571]">
      {images.map((img, index) => (
        <img 
          key={index}
          src={img} 
          alt={`${title} - ${index}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}
      {/* Camada escura que unifica a iluminação das imagens */}
      <div className="absolute inset-0 bg-black/10 z-20 transition-colors group-hover:bg-black/15" />
    </div>
  );
};

const Index = () => {
  const [amount, setAmount] = useState<number>(1000);
  const [result, setResult] = useState<number>(0);
  const [currentRate, setCurrentRate] = useState<number>(0); 
  const [fromCurr, setFromCurr] = useState("USD");
  const [toCurr, setToCurr] = useState("AOA");

  useEffect(() => {
    const updateResult = async () => {
      const pair = `${fromCurr}_${toCurr}`;
      const officialRate = NEXUS_RATES[pair];

      if (officialRate) {
        setCurrentRate(officialRate);
        setResult(amount * officialRate);
      } else {
        try {
          const rates = await fetchRates(fromCurr);
          const rate = rates[toCurr] || getExchangeRate(fromCurr, toCurr);
          setCurrentRate(rate);
          setResult(amount * rate);
        } catch (error) {
          const fallbackRate = getExchangeRate(fromCurr, toCurr);
          setCurrentRate(fallbackRate);
          setResult(amount * fallbackRate);
        }
      }
    };
    updateResult();
  }, [amount, fromCurr, toCurr]);

  // LINKS ULTRA-ESTÁVEIS DO UNSPLASH SOURCE (Sem marcas d'água e sem quebra de cache local)
  const pgtImages = [
    "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=800&q=80", // Pagamentos digitais rápidos
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80"  // Segurança e dados online
  ];

  const cardImages = [
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80", // Operações via smartphone
    "https://images.unsplash.com/photo-1613243555988-441166d4d6fd?auto=format&fit=crop&w=800&q=80"  // Design de cartões premium
  ];

  const cambioImages = [
    "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80", // Notas e fluxo financeiro estável
    "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=800&q=80"  // Transferências e terminais bancários seguros
  ];

  return (
    <div className="w-full flex flex-col items-center space-y-24 pb-32 animate-in fade-in duration-1000 relative text-left">
      
      {/* MENU LATERAL AJUSTADO */}
      <div className="fixed top-8 right-8 z-[100]"> 
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-white/90 hover:bg-[#1a4571] hover:text-white backdrop-blur-md rounded-full w-14 h-14 shadow-2xl transition-all duration-300 group border border-slate-200/50">
              <Menu className="text-[#1a4571] group-hover:text-white w-7 h-7 transition-colors" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] bg-white border-none shadow-2xl">
            <SheetHeader className="pb-8 border-b border-slate-100 text-left">
              <SheetTitle className="text-[#1a4571] font-black text-2xl tracking-tighter flex items-center gap-2">
                <div className="w-2 h-8 bg-[#1a4571] rounded-full" />
                NEXUS MENU
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-3 mt-10">
              {[
                { label: "Comprar", icon: <Wallet size={20} />, path: "/buy" },
                { label: "Vender", icon: <HandCoins size={20} />, path: "/sell" },
                { label: "Serviços", icon: <LayoutGrid size={20} />, path: "/services" },
                { label: "Suporte", icon: <Headphones size={20} />, path: "/support" },
              ].map((item) => (
                <Button key={item.label} variant="ghost" asChild className="w-full justify-start gap-4 h-16 font-bold text-slate-600 hover:text-[#1a4571] hover:bg-blue-50/50 transition-all rounded-2xl group/item">
                  <Link to={item.path}>
                    <span className="text-[#1a4571]">{item.icon}</span>
                    {item.label}
                  </Link>
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div> 

      {/* SEÇÃO 1: CONVERSOR */}
      <Card 
        data-aos="fade-up"
        className="w-full p-8 md:p-12 border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white rounded-xl"
      >
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-8 text-left">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-[#1a4571] tracking-tight italic">Nexus Premium Banking</h2>
              <p className="text-slate-500 font-medium text-sm italic">O seu câmbio seguro e transparente.</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest block">Montante a consultar</label>
                <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="h-16 text-2xl font-black border-slate-200 focus:border-[#1a4571] bg-slate-50/50" placeholder="0.00" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <CurrencySelect label="De" value={fromCurr} onChange={(val) => setFromCurr(val)} />
                <CurrencySelect label="Para" value={toCurr} onChange={(val) => setToCurr(val)} />
              </div>
            </div>
            <Button className="w-full h-16 bg-[#1a4571] hover:bg-black text-white font-bold text-lg rounded-md transition-all shadow-xl">
              SIMULAR OPERAÇÃO EM TEMPO REAL <ArrowRight className="ml-2" />
            </Button>
          </div>

          {/* PAINEL DE RESULTADOS */}
          <div className="w-full lg:w-80 bg-[#1a4571] p-8 rounded-2xl text-white flex flex-col justify-between shadow-2xl min-h-[220px] overflow-hidden relative text-left">
            <div>
              <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest block mb-4">Cotação Nexus</span>
              <div className="mt-4">
                <ConversionResult amount={result} currency={toCurr} fromCurrency={fromCurr} rate={currentRate} />
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-blue-800/50 text-[10px] text-blue-200 leading-relaxed italic">* Valores baseados na taxa média de Angola para operações digitais.</div>
          </div>
        </div>
      </Card>

      {/* SEÇÃO 2: MANIFESTO */}
      <section data-aos="fade-up" className="text-center space-y-8 max-w-5xl px-4">
        <h2 className="text-[#1a4571] font-black text-4xl md:text-6xl tracking-tighter leading-[1.1]">Faça os seus pagamentos de forma segura com a Nexus Change</h2>
        <div className="w-24 h-2 bg-[#1a4571] mx-auto rounded-full"></div>
        <p className="text-xl text-slate-600 font-medium leading-relaxed italic">A Nexus Change é a ponte tecnológica para quem deseja operar no mercado internacional sem possuir uma conta externa. Garantimos que o seu Kwanza chegue a qualquer parte do mundo através dos nossos serviços especializados.</p>
      </section>

      {/* SEÇÃO 3: SERVIÇOS VERTICAIS INDIVIDUAIS */}
      <div className="w-full max-w-5xl space-y-32 px-4">
        
        {/* SERVIÇO 1: PAGAMENTO NO EXTERIOR */}
        <div data-aos="fade-up" className="flex flex-col gap-12 md:flex-row items-center">
          <div className="w-full md:w-1/2">
            <ServiceCarousel images={pgtImages} title="Pagamento de Compra no Exterior" />
          </div>
          <div className="w-full md:w-1/2 space-y-6 text-left">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-50 text-[#1a4571] rounded-2xl"><ShoppingBag size={24} /></div>
              <h3 className="text-3xl font-black text-[#1a4571] tracking-tight">Pagamento de Compra no Exterior</h3>
            </div>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              Ideal para quem não possui conta internacional. A Nexus Change efetua os seus pagamentos em sites como Amazon, eBay ou Alibaba com segurança total e agilidade.
            </p>
          </div>
        </div>

        {/* SERVIÇO 2: AUXÍLIO NA CRIAÇÃO DE CARTÕES E CONTAS VISA */}
        <div data-aos="fade-up" className="flex flex-col gap-12 md:flex-row-reverse items-center">
          <div className="w-full md:w-1/2">
            <ServiceCarousel images={cardImages} title="Criação de Cartões e Contas" />
          </div>
          <div className="w-full md:w-1/2 space-y-6 text-left">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-50 text-[#1a4571] rounded-2xl"><CreditCard size={24} /></div>
              <h3 className="text-3xl font-black text-[#1a4571] tracking-tight">Criação de Cartões e Contas</h3>
            </div>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              Acesso imediato ao mercado digital global. Auxiliamos na criação e recarga de cartões e contas VISA nas fintechs e plataformas de referência internacional: **Wise, Bybit, Eversend e RedotPay**.
            </p>
            
            <div className="pt-4 border-t border-slate-100">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3">Plataformas Suportadas (Links Oficiais):</span>
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href="https://wise.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200/60 rounded-2xl font-bold text-sm text-slate-700 transition-all hover:translate-y-[-2px] group"
                >
                  <span>Wise Bank</span>
                  <span className="text-blue-600 font-black opacity-60 group-hover:opacity-100 transition-opacity">→</span>
                </a>
                <a 
                  href="https://www.bybit.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between p-4 bg-slate-50 hover:bg-amber-50 border border-slate-200/60 rounded-2xl font-bold text-sm text-slate-700 transition-all hover:translate-y-[-2px] group"
                >
                  <span>Bybit Card</span>
                  <span className="text-amber-500 font-black opacity-60 group-hover:opacity-100 transition-opacity">→</span>
                </a>
                <a 
                  href="https://redotpay.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between p-4 bg-slate-50 hover:bg-red-50 border border-slate-200/60 rounded-2xl font-bold text-sm text-slate-700 transition-all hover:translate-y-[-2px] group"
                >
                  <span>RedotPay Visa</span>
                  <span className="text-red-500 font-black opacity-60 group-hover:opacity-100 transition-opacity">→</span>
                </a>
                <a 
                  href="https://eversend.co" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200/60 rounded-2xl font-bold text-sm text-slate-700 transition-all hover:translate-y-[-2px] group"
                >
                  <span>Eversend</span>
                  <span className="text-emerald-600 font-black opacity-60 group-hover:opacity-100 transition-opacity">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* SERVIÇO 3: COMPRA E VENDA DE DIVISAS */}
        <div data-aos="fade-up" className="flex flex-col gap-12 md:flex-row items-center">
          <div className="w-full md:w-1/2">
            <ServiceCarousel images={cambioImages} title="Compra e Venda de Divisas" />
          </div>
          <div className="w-full md:w-1/2 space-y-6 text-left">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-50 text-[#1a4571] rounded-2xl"><Repeat size={24} /></div>
              <h3 className="text-3xl font-black text-[#1a4571] tracking-tight">Compra e Venda de Divisas</h3>
            </div>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              Transações físicas e digitais estáveis de USD, EUR, ZAR e BRL. Operações seguras com as cotações mais competitivas de Angola, garantindo total transparência e liquidez imediata.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Index;