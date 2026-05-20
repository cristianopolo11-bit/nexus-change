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
  ShoppingBag, 
  CreditCard, 
  Repeat, 
  Menu,
  Wallet,
  HandCoins,
  Headphones,
  LayoutGrid,
  Facebook,  
  Instagram  
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

// COMPONENTE HERO PREMIUM CONTROLADO PELO REACT COM SLIDE LATERAL E TEXTOS OVERLAY
const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1600&q=80",
      title: "Parcerias de Sucesso",
      description: "Conectamos as suas necessidades locais ao mercado global com total segurança e seriedade corporativa."
    },
    {
      url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=80",
      title: "Proteção para a Família",
      description: "Garantimos a estabilidade e facilidade financeira que assegura o futuro de quem mais ama."
    },
    {
      url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1600&q=80",
      title: "Atendimento Humanizado",
      description: "Uma equipa dedicada e online pronta para liquidar e validar as suas ordens em minutos."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // Troca automática a cada 5 segundos
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="w-full h-[45vh] relative overflow-hidden bg-slate-900">
      {/* Container de movimentação infinita da direita para a esquerda */}
      <div 
        className="flex h-full w-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div 
            key={index}
            className="w-full h-full shrink-0 relative bg-cover bg-center flex items-center"
            style={{ backgroundImage: `url('${slide.url}')` }}
          >
            {/* Película escura protetora para legibilidade absoluta do texto */}
            <div className="absolute inset-0 bg-black/40 z-10" />
            
            {/* Bloco de Conteúdo Textual por cima do Banner */}
            <div className="max-w-5xl mx-auto w-full px-6 md:px-12 z-20 text-white space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tight drop-shadow-md">
                {slide.title}
              </h1>
              <p className="text-sm md:text-lg text-blue-100 font-medium max-w-xl drop-shadow-sm leading-relaxed">
                {slide.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// COMPONENTE DE CARROSSEL REENGENHARIZADO PARA OS CARDS DE SERVIÇOS
const ServiceCarousel = ({ images, title }: { images: string[], title: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500); 
    return () => clearInterval(timer);
  }, [images.length]);

  return (
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

  const pgtImages = [
    "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=800&q=80", 
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80"  
  ];

  const cardImages = [
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80", 
    "https://images.unsplash.com/photo-1613243555988-441166d4d6fd?auto=format&fit=crop&w=800&q=80"  
  ];

  const cambioImages = [
    "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80", 
    "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=800&q=80"  
  ];

  return (
    <div className="w-full flex flex-col items-center relative text-left">
      
      {/* CARROSSEL HERO REACT EM SLIDE ATIVO */}
      <HeroSlider />

      {/* BLOCO CENTRAL REPOSICIONADO SOBRE O BANNER */}
      <div className="w-full max-w-6xl mx-auto px-6 -mt-16 space-y-24 pb-0 z-20 relative">
        
        {/* MENU LATERAL AJUSTADO */}
        <div className="absolute -top-48 right-6 z-[100]"> 
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

        {/* SEÇÃO 1: CONVERSOR SIMPLIFICADO */}
        <Card 
          data-aos="fade-up"
          className="w-full p-8 md:p-12 border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white rounded-xl"
        >
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 space-y-8 text-left w-full">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold text-[#1a4571] tracking-tight italic">Nexus Premium Banking</h2>
                <p className="text-slate-500 font-medium text-sm italic">O seu câmbio seguro e transparente com atualização imediata.</p>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest block">Montante a consultar</label>
                  <Input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(Number(e.target.value))} 
                    className="h-16 text-2xl font-black border-slate-200 focus:border-[#1a4571] bg-slate-50/50 rounded-2xl" 
                    placeholder="0.00" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <CurrencySelect label="De" value={fromCurr} onChange={(val) => setFromCurr(val)} />
                  <CurrencySelect label="Para" value={toCurr} onChange={(val) => setToCurr(val)} />
                </div>
              </div>
            </div>

            {/* PAINEL DE RESULTADOS */}
            <div className="w-full lg:w-80 bg-[#1a4571] p-8 rounded-2xl text-white flex flex-col justify-between shadow-2xl min-h-[220px] overflow-hidden relative text-left self-stretch">
              <div>
                <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest block mb-4">Cotação Nexus</span>
                <div className="mt-4">
                  <ConversionResult amount={result} currency={toCurr} fromCurrency={fromCurr} rate={currentRate} />
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-blue-800/50 text-[10px] text-blue-200 leading-relaxed italic">* Valores baseados na taxa de câmbio digital em tempo real.</div>
            </div>
          </div>
        </Card>

        {/* SEÇÃO 2: MANIFESTO */}
        <section data-aos="fade-up" className="text-center space-y-8 max-w-5xl mx-auto px-4">
          <h2 className="text-[#1a4571] font-black text-4xl md:text-6xl tracking-tighter leading-[1.1]">Faça os seus pagamentos de forma segura com a Nexus Change</h2>
          <div className="w-24 h-2 bg-[#1a4571] mx-auto rounded-full"></div>
          <p className="text-xl text-slate-600 font-medium leading-relaxed italic">A Nexus Change é a ponte tecnológica para quem deseja operar no mercado internacional sem possuir uma conta externa. Garantimos que o seu Kwanza chegue a qualquer parte do mundo através dos nossos serviços especializados.</p>
        </section>

        {/* SEÇÃO 3: SERVIÇOS VERTICAIS INDIVIDUAIS */}
        <div className="w-full space-y-32">
          
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
                  <a href="https://wise.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200/60 rounded-2xl font-bold text-sm text-slate-700 transition-all hover:translate-y-[-2px] group">
                    <span>Wise Bank</span>
                    <span className="text-blue-600 font-black opacity-60 group-hover:opacity-100 transition-opacity">→</span>
                  </a>
                  <a href="https://www.bybit.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-amber-50 border border-slate-200/60 rounded-2xl font-bold text-sm text-slate-700 transition-all hover:translate-y-[-2px] group">
                    <span>Bybit Card</span>
                    <span className="text-amber-500 font-black opacity-60 group-hover:opacity-100 transition-opacity">→</span>
                  </a>
                  <a href="https://redotpay.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-red-50 border border-slate-200/60 rounded-2xl font-bold text-sm text-slate-700 transition-all hover:translate-y-[-2px] group">
                    <span>RedotPay Visa</span>
                    <span className="text-red-500 font-black opacity-60 group-hover:opacity-100 transition-opacity">→</span>
                  </a>
                  <a href="https://eversend.co" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200/60 rounded-2xl font-bold text-sm text-slate-700 transition-all hover:translate-y-[-2px] group">
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

      {/* SEÇÃO 4: RODAPÉ UNIFICADO E INTEGRADO */}
      <footer className="w-full bg-white border-t border-slate-100 py-12 mt-24 z-20">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          
          {/* ÍCONES SOCIAIS PREMIUM APONTADOS PARA O INSTAGRAM OFICIAL DE SUPORTE */}
          <div className="flex justify-center items-center gap-6">
            <a 
              href="https://www.instagram.com/nexuschangesuporte" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-slate-50 text-[#1a4571] hover:bg-[#1a4571] hover:text-white transition-all duration-300 shadow-sm hover:scale-110"
              aria-label="Siga a Nexus Change no Facebook"
            >
              <Facebook size={22} />
            </a>

            <a 
              href="https://www.instagram.com/nexuschangesuporte" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-slate-50 text-[#1a4571] hover:bg-[#1a4571] hover:text-white transition-all duration-300 shadow-sm hover:scale-110"
              aria-label="Siga a Nexus Change no Instagram"
            >
              <Instagram size={22} />
            </a>
          </div>

          {/* MENUS INSTITUCIONAIS */}
          <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-xs font-black uppercase tracking-wider text-slate-400">
            <a href="/about" className="hover:text-[#1a4571] transition-colors">Sobre Nós</a>
            <a href="/faq" className="hover:text-[#1a4571] transition-colors">FAQ</a>
            <a href="/privacy" className="hover:text-[#1a4571] transition-colors">Privacidade</a>
            <a href="/terms" className="hover:text-[#1a4571] transition-colors">Termos</a>
          </div>

          {/* CRÉDITOS OFICIAIS */}
          <div className="pt-4 border-t border-slate-50 space-y-1">
            <p className="text-slate-500 text-sm font-black italic uppercase tracking-tight">
              Nexus Change — Soluções Inteligentes para Angola
            </p>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-black">
              Plataforma de Atendimento 100% Digital e Segura
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Index;