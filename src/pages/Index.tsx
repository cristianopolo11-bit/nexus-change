   
 import React, { useState, useEffect, useRef, useCallback } from "react";
 import { Link } from "react-router-dom";
 import CurrencySelect from "@/components/CurrencySelect";
 import ConversionResult from "@/components/ConversionResult";
 import { Button } from "@/components/ui/button";
 import { Card } from "@/components/ui/card";
 import { Input } from "@/components/ui/input";
 import { convert, getExchangeRate } from "@/lib/currencies";
 import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
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
   ShieldCheck,
   Zap,
   Star,
   Clock,
   ArrowRightLeft,
   ChevronRight,
   TrendingDown,
   RefreshCw,
   CheckCircle2,
   Copy,
   Globe,
   ChevronDown,
   AlertTriangle,
   BadgeCheck,
   TrendingUp as TrendIcon,
   ArrowLeft,
   Info,
   FileText,
   HelpCircle,
   Lock,
   Users,
   Send
 } from "lucide-react";
 
 // ─── CONSTANTES ────────────────────────────────────────────────────────
 const NEXUS_RATES: Record<string, number> = {
   "USD_AOA": 1120,
   "EUR_AOA": 1300,
   "USDT_AOA": 1120,
   "USDC_AOA": 1120,
   "BRL_AOA": 180,
 };
 
 const FAQS = [
   {
     question: "Como funciona a compra de divisas?",
     answer: "Insere o valor, escolhe as moedas, preenche os teus dados e enviamos a solicitação diretamente via WhatsApp. Um agente confirma e processa em minutos.",
   },
   {
     question: "Quanto tempo demora a liquidação?",
     answer: "Para a maioria das transações, a liquidação é instantânea após confirmação. Transferências bancárias podem demorar até 24h úteis.",
   },
   {
     question: "As taxas são fixas ou variam?",
     answer: "As taxas são atualizadas em tempo real conforme o mercado. O valor que vês no simulador é o valor que recebes na liquidação.",
   },
   {
     question: "É seguro operar pela Nexus?",
     answer: "Sim. Todas as operações são validadas por agentes verificados e seguimos protocolos rigorosos de conformidade e segurança.",
   },
 ] as const;
 
 const SUPPORTED_PLATFORMS = [
   "Wise Bank", "Bybit Card", "RedotPay Visa", "Eversend",
 ] as const;
 
 const SUPPORTED_CURRENCIES = ["USD", "EUR", "ZAR", "BRL", "USDT"] as const;
 
 // ─── HOOKS PERSONALIZADOS ──────────────────────────────────────────────
 const useIntersectionObserver = (threshold = 0.3) => {
   const ref = useRef<HTMLDivElement>(null);
   const [isVisible, setIsVisible] = useState(false);
 
   useEffect(() => {
     const observer = new IntersectionObserver(
       ([entry]) => {
         if (entry.isIntersecting) {
           setIsVisible(true);
           observer.disconnect();
         }
       },
       { threshold }
     );
     if (ref.current) observer.observe(ref.current);
     return () => observer.disconnect();
   }, [threshold]);
 
   return { ref, isVisible };
 };
 
 const useScrollPosition = () => {
   const [scrollY, setScrollY] = useState(0);
 
   useEffect(() => {
     const handleScroll = () => setScrollY(window.scrollY);
     window.addEventListener("scroll", handleScroll, { passive: true });
     return () => window.removeEventListener("scroll", handleScroll);
   }, []);
 
   return scrollY;
 };
 
 // ─── HERO SLIDER COMPONENTE ───────────────────────────────────────────
 interface SlideData {
   url: string;
   title: string;
   description: string;
   icon: React.ReactNode;
 }
 
 const HeroSlider = () => {
   const [currentIndex, setCurrentIndex] = useState(0);
   const [isPaused, setIsPaused] = useState(false);
   const [isTransitioning, setIsTransitioning] = useState(false);
   const touchStartX = useRef(0);
 
   const slides: SlideData[] = [
     {
       url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1600&q=80",
       title: "Parcerias de Sucesso",
       description: "Conectamos as suas necessidades locais ao mercado global com total segurança e seriedade corporativa.",
       icon: <Globe size={20} />,
     },
     {
       url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=80",
       title: "Proteção para a Família",
       description: "Garantimos a estabilidade e facilidade financeira que assegura o futuro de quem mais ama.",
       icon: <ShieldCheck size={20} />,
     },
     {
       url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1600&q=80",
       title: "Atendimento Humanizado",
       description: "Uma equipa dedicada e online pronta para liquidar e validar as suas ordens in minutes.",
       icon: <Headphones size={20} />,
     },
   ];
 
   const goToSlide = useCallback((index: number) => {
     if (isTransitioning) return;
     setIsTransitioning(true);
     setCurrentIndex(index);
     setTimeout(() => setIsTransitioning(false), 1000);
   }, [isTransitioning]);
 
   const goNext = useCallback(() => {
     goToSlide((currentIndex + 1) % slides.length);
   }, [currentIndex, slides.length, goToSlide]);
 
   const goPrev = useCallback(() => {
     goToSlide((currentIndex - 1 + slides.length) % slides.length);
   }, [currentIndex, slides.length, goToSlide]);
 
   useEffect(() => {
     if (isPaused) return;
     const timer = setInterval(goNext, 5000);
     return () => clearInterval(timer);
   }, [isPaused, goNext]);
 
   return (
     <div
       className="w-full h-[45vh] md:h-[55vh] relative overflow-hidden bg-slate-900 group text-left"
       onMouseEnter={() => setIsPaused(true)}
       onMouseLeave={() => setIsPaused(false)}
       onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
       onTouchEnd={(e) => {
         const diff = touchStartX.current - e.changedTouches[0].clientX;
         if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
       }}
       role="region"
       aria-label="Slider de destaques"
     >
       <div
         className="flex h-full w-full transition-transform duration-1000 ease-out will-change-transform"
         style={{ transform: `translateX(-${currentIndex * 100}%)` }}
       >
         {slides.map((slide, index) => (
           <div
             key={index}
             className="w-full h-full shrink-0 relative bg-cover bg-center flex items-center"
             style={{ backgroundImage: `url('${slide.url}')` }}
           >
             <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 z-10" />
             <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 z-20 text-white space-y-4 text-left w-full">
               <span className="inline-flex items-center gap-2 bg-amber-400 px-4 py-1.5 rounded-full text-xs font-black text-[#1a4571] uppercase tracking-wider shadow-lg">
                 {slide.icon}
                 Nexus Operações
               </span>
               <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight drop-shadow-xl max-w-2xl leading-tight">
                 {slide.title}
               </h1>
               <p className="text-sm md:text-base lg:text-lg text-amber-50 font-medium max-w-xl drop-shadow-md leading-relaxed opacity-90">
                 {slide.description}
               </p>
             </div>
           </div>
         ))}
       </div>
     </div>
   );
 };
 
 // ─── CARROSSEL DE SERVIÇOS ─────────────────────────────────────────────
 interface ServiceCarouselProps {
   images: string[];
   title: string;
 }
 
 const ServiceCarousel = ({ images, title }: ServiceCarouselProps) => {
   const [currentIndex, setCurrentIndex] = useState(0);
   const [isHovered, setIsHovered] = useState(false);
 
   useEffect(() => {
     if (!images || images.length <= 1 || isHovered) return;
     const timer = setInterval(() => {
       setCurrentIndex((prev) => (prev + 1) % images.length);
     }, 4500);
     return () => clearInterval(timer);
   }, [images.length, isHovered]);
 
   return (
     <div
       className="relative w-full h-[260px] md:h-[360px] overflow-hidden rounded-3xl group border-4 border-amber-400 shadow-2xl bg-[#1a4571]"
       onMouseEnter={() => setIsHovered(true)}
       onMouseLeave={() => setIsHovered(false)}
       role="img"
       aria-label={title}
     >
       {images.map((img, index) => (
         <img
           key={index}
           src={img}
           alt={`${title} - imagem ${index + 1}`}
           className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
             index === currentIndex ? "opacity-100 scale-100 z-10" : "opacity-0 scale-110 z-0"
           }`}
           loading="lazy"
          />
       ))}
       <div className="absolute inset-0 bg-black/20 z-20 transition-colors group-hover:bg-black/40" />
     </div>
   );
 };
 
 // ─── TICKER DE TAXAS ───────────────────────────────────────────────────
 const LiveRatesTicker = () => {
   const rates = [
     { pair: "USD/AOA", rate: 1120, trend: "up" as const },
     { pair: "EUR/AOA", rate: 1300, trend: "stable" as const },
     { pair: "USDT/AOA", rate: 1120, trend: "up" as const },
     { pair: "USDC/AOA", rate: 1120, trend: "stable" as const },
     { pair: "BRL/AOA", rate: 180, trend: "down" as const },
   ];
   const duplicatedRates = [...rates, ...rates, ...rates];
 
   return (
     <div className="w-full bg-[#1a4571] py-3 overflow-hidden border-y-2 border-amber-400 relative">
       <div className="flex whitespace-nowrap animate-[scroll_25s_linear_infinite] hover:[animation-play-state:paused]">
         {duplicatedRates.map((rate, index) => (
           <div key={index} className="flex items-center gap-2 mx-8 text-sm font-bold shrink-0">
             <BadgeCheck size={14} className="text-amber-400" />
             <span className="text-amber-400">{rate.pair}</span>
             <span className="text-white tabular-nums">{rate.rate.toLocaleString("pt-PT")}</span>
             {rate.trend === "up" && <TrendIcon size={14} className="text-emerald-400" />}
             {rate.trend === "down" && <TrendingDown size={14} className="text-red-400" />}
             {rate.trend === "stable" && <span className="text-slate-400">—</span>}
           </div>
         ))}
       </div>
     </div>
   );
 };
 
 // ─── FAQ ACCORDION ─────────────────────────────────────────────────────
 interface FAQItemProps {
   question: string;
   answer: string;
   isOpen: boolean;
   onToggle: () => void;
 }
 
 const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => {
   const contentRef = useRef<HTMLDivElement>(null);
   const [height, setHeight] = useState(0);
 
   useEffect(() => {
     if (contentRef.current) setHeight(isOpen ? contentRef.current.scrollHeight : 0);
   }, [isOpen]);
 
   return (
     <div className="border-2 border-amber-200 rounded-2xl overflow-hidden transition-all duration-300 bg-white hover:border-amber-400 hover:shadow-md">
       <button
         type="button"
         onClick={onToggle}
         className="w-full flex items-center justify-between p-5 hover:bg-amber-50/50 transition-colors duration-300 text-left focus:outline-none"
       >
         <span className="font-black text-[#1a4571] text-sm pr-4">{question}</span>
         <ChevronDown size={20} className={`text-amber-500 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
       </button>
       <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: height }}>
         <div className="p-5 pt-0">
           <p ref={contentRef} className="text-sm text-slate-600 font-medium leading-relaxed bg-amber-50/30 rounded-xl p-4 border border-amber-100">
             {answer}
           </p>
         </div>
       </div>
     </div>
   );
 };
 
 // ─── CARD DE SERVIÇO ───────────────────────────────────────────────────
 interface ServiceCardProps {
   images: string[];
   title: string;
   description: string;
   icon: React.ReactNode;
   reverse?: boolean;
   tags?: string[];
 }
 
 const ServiceCard = ({ images, title, description, icon, reverse = false, tags }: ServiceCardProps) => {
   const { ref, isVisible } = useIntersectionObserver(0.2);
 
   return (
     <div
       ref={ref}
       className={`flex flex-col gap-10 ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center transition-all duration-700 ${
         isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
       }`}
     >
       <div className="w-full md:w-1/2">
         <ServiceCarousel images={images} title={title} />
       </div>
       <div className="w-full md:w-1/2 space-y-5 text-left">
         <div className="flex items-center gap-3">
           <div className="p-3.5 bg-amber-400 text-[#1a4571] rounded-2xl border-2 border-amber-500 shadow-lg">
             {icon}
           </div>
           <h3 className="text-2xl font-black text-[#1a4571] tracking-tight">{title}</h3>
         </div>
         <p className="text-base text-slate-600 leading-relaxed font-medium">
           {description}
         </p>
         {tags && (
           <div className="flex gap-2 flex-wrap pt-2">
             {tags.map((tag) => (
               <span key={tag} className="px-3 py-1.5 bg-amber-100 text-[#1a4571] rounded-full text-xs font-black border border-amber-200">
                 {tag}
               </span>
             ))}
           </div>
         )}
       </div>
     </div>
   );
 };
 
 // ═══════════════════════════════════════════════════════════════════════
 // COMPONENTE PRINCIPAL
 // ═══════════════════════════════════════════════════════════════════════
 const Index = () => {
   const [amount, setAmount] = useState<number>(1000);
   const [result, setResult] = useState<number>(0);
   const [currentRate, setCurrentRate] = useState<number>(0);
   const [fromCurr, setFromCurr] = useState("USD");
   const [toCurr, setToCurr] = useState("AOA");
   const [isConverting, setIsConverting] = useState(false);
   const [copiedResult, setCopiedResult] = useState(false);
   const [openFAQ, setOpenFAQ] = useState<number | null>(null);
   const [inputError, setInputError] = useState<string | null>(null);
 
   const [menuLevel, setMenuLevel] = useState<"main" | "services" | "info">("main");
   const [sheetOpen, setSheetOpen] = useState(false);
 
   const scrollY = useScrollPosition();
   const showScrollTop = scrollY > 400;
   const isHeaderSticky = scrollY > 100;
 
   useEffect(() => {
     const timeout = setTimeout(async () => {
       if (amount <= 0) { setResult(0); setCurrentRate(0); setInputError("O valor deve ser superior a zero"); return; }
       setInputError(null);
       setIsConverting(true);
 
       const pair = `${fromCurr}_${toCurr}`;
       const officialRate = NEXUS_RATES[pair];
 
       if (officialRate) {
         setCurrentRate(officialRate);
         setResult(amount * officialRate);
       } else {
         try {
           const totalConvertido = await convert(amount, fromCurr, toCurr, false);
           setResult(totalConvertido);
           setCurrentRate(totalConvertido / amount);
         } catch (error) {
           const fallbackRate = getExchangeRate(fromCurr, toCurr, false) ?? 1;
           setCurrentRate(fallbackRate);
           setResult(amount * fallbackRate);
         }
       }
       setTimeout(() => setIsConverting(false), 200);
     }, 300);
 
     return () => clearTimeout(timeout);
   }, [amount, fromCurr, toCurr]);
 
   const pgtImages = [
     "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=800&q=80",
     "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
   ];
 
   const cardImages = [
     "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
     "https://images.unsplash.com/photo-1613243555988-441166d4d6fd?auto=format&fit=crop&w=800&q=80",
   ];
 
   const cambioImages = [
     "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80",
     "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=800&q=80",
   ];
 
   return (
     <div className="min-h-screen w-full bg-amber-50 font-sans text-slate-900 antialiased selection:bg-amber-300 selection:text-[#1a4571]">
       
       {/* HEADER STICKY */}
       <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isHeaderSticky ? "bg-white/90 backdrop-blur-xl shadow-lg border-b-2 border-amber-200 py-3" : "bg-transparent py-4"}`}>
         <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
           <Link to="/" className="flex items-center gap-2 group">
             <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
               <Zap size={20} className="text-[#1a4571]" />
             </div>
             <span className={`font-black text-lg tracking-tight transition-colors ${isHeaderSticky ? "text-[#1a4571]" : "text-white"}`}>
               Nexus Money
             </span>
           </Link>
 
           <div className="flex items-center gap-3">
             <Paper />
             <Sheet open={sheetOpen} onOpenChange={(open) => { setSheetOpen(open); if(!open) setMenuLevel("main"); }}>
               <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="bg-amber-400 border-2 border-amber-500 hover:bg-amber-300 rounded-xl w-10 h-10 shadow-lg transition-all hover:scale-110">
                   <Menu className="text-[#1a4571] w-5 h-5" />
                 </Button>
               </SheetTrigger>
               <SheetContent side="right" className="w-[320px] bg-white border-l-4 border-amber-400 shadow-2xl flex flex-col justify-between">
                 <div>
                   <SheetHeader className="pb-6 border-b-2 border-amber-100 text-left">
                     <SheetTitle className="text-[#1a4571] font-black text-2xl tracking-tighter flex items-center gap-3">
                       <div className="w-3 h-8 bg-amber-400 rounded-full" />
                       {menuLevel === "main" && "NEXUS MENU"}
                       {menuLevel === "services" && "SERVIÇOS"}
                       {menuLevel === "info" && "INFORMAÇÕES"}
                     </SheetTitle>
                   </SheetHeader>
 
                   {/* NÍVEL 1: MENU PRINCIPAL */}
                   {menuLevel === "main" && (
                     <nav className="flex flex-col gap-2 mt-6">
                       <Button
                         variant="ghost"
                         onClick={() => setMenuLevel("services")}
                         className="w-full h-16 font-black text-base text-slate-700 hover:text-[#1a4571] hover:bg-amber-50/70 justify-between pr-4 rounded-xl group transition-all"
                       >
                         <div className="flex items-center gap-4">
                           <span className="bg-amber-100 p-2.5 rounded-xl text-[#1a4571] group-hover:bg-amber-400 transition-colors">
                             <LayoutGrid size={20} />
                           </span>
                           <span>Serviços</span>
                         </div>
                         <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                       </Button>
                     </nav>
                   )}
 
                   {/* NÍVEL 2: SUB-MENU SERVIÇOS */}
                   {menuLevel === "services" && (
                     <div className="mt-4 flex flex-col gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                       {[
                         { label: "Comprar Ativos", icon: Wallet, path: "/buy", desc: "Adquirir divisas" },
                         { label: "Vender Ativos", icon: HandCoins, path: "/sell", desc: "Liquidar moedas" },
                         { label: "Transferências", icon: ArrowRightLeft, path: "/transfer", desc: "Remessas internacionais" },
                         { label: "Suporte", icon: Headphones, path: "/support", desc: "Ajuda imediata 24/7" },
                       ].map((item) => (
                         <Button
                           key={item.label}
                           variant="ghost"
                           asChild
                           onClick={() => setSheetOpen(false)}
                           className="w-full h-16 justify-start gap-4 font-bold text-slate-600 hover:text-[#1a4571] hover:bg-amber-50/50 rounded-xl group"
                         >
                           <Link to={item.path}>
                             <span className="bg-amber-50 p-2.5 rounded-xl text-[#1a4571] group-hover:bg-amber-400 transition-colors">
                               <item.icon size={18} />
                             </span>
                             <div className="text-left">
                               <div className="text-sm font-black">{item.label}</div>
                               <div className="text-xs text-slate-400 font-medium">{item.desc}</div>
                             </div>
                           </Link>
                         </Button>
                       ))}
 
                       <Button
                         variant="ghost"
                         onClick={() => setMenuLevel("info")}
                         className="w-full h-16 font-bold text-slate-600 hover:text-[#1a4571] hover:bg-amber-50/50 justify-between pr-4 rounded-xl group"
                       >
                         <div className="flex items-center gap-4">
                           <span className="bg-amber-50 p-2.5 rounded-xl text-[#1a4571] group-hover:bg-amber-400 transition-colors">
                             <Info size={18} />
                           </span>
                           <div className="text-left">
                             <div className="text-sm font-black">Informações</div>
                             <div className="text-xs text-slate-400 font-medium">Sobre a nossa plataforma</div>
                           </div>
                         </div>
                         <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                       </Button>
                     </div>
                   )}
 
                   {/* NÍVEL 3: SUB-MENU INFORMAÇÕES */}
                   {menuLevel === "info" && (
                     <div className="mt-4 flex flex-col gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                       {[
                         { label: "Termos", icon: FileText, path: "/terms" },
                         { label: "FAQ", icon: HelpCircle, path: "/faq" },
                         { label: "Privacidade", icon: Lock, path: "/privacy" },
                         { label: "Sobre Nós", icon: Users, path: "/about" },
                       ].map((sub) => (
                         <Button
                           key={sub.label}
                           variant="ghost"
                           asChild
                           onClick={() => setSheetOpen(false)}
                           className="w-full h-14 justify-start gap-4 font-bold text-slate-600 hover:text-[#1a4571] hover:bg-amber-50/50 rounded-xl group"
                         >
                           <Link to={sub.path}>
                             <span className="bg-amber-50/50 p-2 rounded-lg text-slate-500 group-hover:bg-amber-400 group-hover:text-[#1a4571] transition-all">
                               <sub.icon size={16} />
                             </span>
                             <span className="text-sm font-black">{sub.label}</span>
                           </Link>
                         </Button>
                       ))}
                     </div>
                   )}
                 </div>
 
                 {menuLevel !== "main" && (
                   <Button
                     variant="outline"
                     onClick={() => setMenuLevel(menuLevel === "info" ? "services" : "main")}
                     className="w-full h-12 border-2 border-amber-200 text-[#1a4571] font-black uppercase tracking-wider rounded-xl mt-auto flex items-center justify-center gap-2 hover:bg-amber-50"
                   >
                     <ArrowLeft size={16} />
                     Voltar
                   </Button>
                 )}
               </SheetContent>
             </Sheet>
           </div>
         </div>
       </header>
 
       <HeroSlider />
       <LiveRatesTicker />
 
       {/* SCROLL TO TOP */}
       <button
         type="button"
         onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
         className={`fixed bottom-6 right-6 z-50 w-12 h-12 bg-amber-400 text-[#1a4571] rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 hover:bg-amber-300 ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16 pointer-events-none"}`}
         aria-label="Voltar ao topo"
       >
         <ChevronDown size={24} className="-rotate-180" />
       </button>
 
       {/* CONTEÚDO PRINCIPAL */}
       <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 -mt-12 space-y-24 pb-20 z-20 relative">
 
         {/* SIMULADOR */}
         <Card className="w-full p-6 md:p-10 border-4 border-amber-400 shadow-[0_25px_60px_-15px_rgba(251,191,36,0.3)] bg-white rounded-[2.5rem] overflow-hidden relative">
           <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-200 rounded-full opacity-20 blur-3xl" />
           <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch relative z-10">
             <div className="flex-1 space-y-6 text-left">
               <div className="space-y-2">
                 <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                   <Zap size={12} className="animate-pulse" /> Operação Imediata
                 </div>
                 <h2 className="text-3xl font-black text-[#1a4571] tracking-tight">Nexus Premium Banking</h2>
                 <p className="text-slate-500 font-medium text-sm">Câmbio seguro e transparente com liquidação direta.</p>
               </div>
 
               <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-xs font-black uppercase text-slate-400 tracking-widest block">Montante a consultar</label>
                   <div className="relative group">
                     <Input
                       type="number"
                       min={0}
                       step={0.01}
                       value={amount}
                       onChange={(e) => setAmount(Number(e.target.value))}
                       className="h-16 text-2xl font-black border-2 border-amber-200 focus-border-amber-400 focus-visible:ring-4 focus-visible:ring-amber-200 bg-amber-50/50 rounded-2xl transition-all pl-4 pr-16"
                       placeholder="0.00"
                     />
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-amber-500 bg-amber-100 px-2 py-1 rounded-lg">{fromCurr}</span>
                   </div>
                   {inputError && (
                     <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold animate-pulse"><AlertTriangle size={14} />{inputError}</div>
                   )}
                 </div>
 
                 <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
                   <CurrencySelect label="De" value={fromCurr} onChange={setFromCurr} />
                   <button
                     type="button"
                     onClick={() => { setFromCurr(toCurr); setToCurr(fromCurr); }}
                     className="p-3 bg-amber-100 rounded-xl hover:bg-amber-200 transition-all duration-300 hover:scale-110 active:scale-95 mb-1 shadow-sm"
                   >
                     <ArrowRightLeft size={18} className="text-[#1a4571]" />
                   </button>
                   <CurrencySelect label="Para" value={toCurr} onChange={setToCurr} />
                 </div>
               </div>
             </div>
 
             {/* PAINEL DE RESULTADOS */}
             <div className="w-full lg:w-80 bg-amber-400 p-6 sm:p-8 rounded-3xl text-[#1a4571] flex flex-col justify-between shadow-inner border-4 border-amber-500 relative text-left min-h-[240px] group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
               <div className="absolute inset-0 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 opacity-60 rounded-3xl" />
               <div className="relative z-10 space-y-4">
                 <div className="flex items-center justify-between">
                   <span className="text-[11px] font-black uppercase tracking-widest opacity-80">Resultado Estimado</span>
                   <button
                     type="button"
                     onClick={() => {
                       navigator.clipboard.writeText(`${result.toLocaleString("pt-PT", { minimumFractionDigits: 2 })} ${toCurr}`);
                       setCopiedResult(true); setTimeout(() => setCopiedResult(false), 2000);
                     }}
                     className="p-2 rounded-xl bg-[#1a4571]/10 hover:bg-[#1a4571]/20 active:bg-[#1a4571]/30 transition-all focus:outline-none"
                   >
                     {copiedResult ? <CheckCircle2 size={16} className="text-emerald-700" /> : <Copy size={16} />}
                   </button>
                 </div>
                 <div className="font-black">
                   {isConverting ? (
                     <div className="flex items-center gap-3 text-2xl"><RefreshCw size={22} className="animate-spin" /><span className="text-lg">A calcular...</span></div>
                   ) : (
                     <ConversionResult amount={result} currency={toCurr} fromCurrency={fromCurr} rate={currentRate} />
                   )}
                 </div>
                 {currentRate > 0 && (
                   <div className="text-xs font-bold opacity-70 flex items-center gap-1">
                     <TrendIcon size={12} />Taxa: 1 {fromCurr} = {currentRate.toLocaleString("pt-PT", { maximumFractionDigits: 4 })} {toCurr}
                   </div>
                 )}
               </div>
               <div className="mt-4 pt-4 border-t border-[#1a4571]/15 text-[10px] font-bold leading-relaxed opacity-70 flex items-center gap-1.5 relative z-10">
                 <Clock size={12} /> Valores em tempo real para liquidação corporativa.
               </div>
             </div>
           </div>
         </Card>
 
         {/* MANIFESTO */}
         <section className="text-center space-y-6 max-w-4xl mx-auto px-4">
           <div className="inline-flex items-center gap-2 bg-amber-400 px-5 py-2 rounded-full text-xs font-black text-[#1a4571] shadow-lg">
             <ShieldCheck size={16} /> Nexus Money — Soluções Inteligentes
           </div>
           <h2 className="text-3xl md:text-5xl font-black text-[#1a4571] tracking-tight leading-tight">Faça os seus pagamentos de forma segura em Angola</h2>
           <div className="w-24 h-2 bg-amber-400 mx-auto rounded-full shadow-sm" />
           <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
             A nossa plataforma atua como a ponte tecnológica ideal para quem deseja operar com máxima fluidez e liquidez local, garantindo que os seus fundos cheguem ao destino com segurança total.
           </p>
         </section>
 
         {/* SERVIÇOS */}
         <div className="w-full space-y-24">
           <ServiceCard images={pgtImages} title="Pagamento de Compra no Exterior" description="Ideal para quem precisa de agilidade operacional. Efetuamos liquidação de faturas e pagamentos de bens ou insumos no mercado externo com total transparência e seriedade." icon={<ShoppingBag size={22} />} />
           <ServiceCard images={cardImages} title="Criação de Cartões e Contas" description="Acesso imediato ao ecossistema global. Auxiliamos na configuração e carregamento de cartões e contas internacionais nas plataformas mais conceituadas do mercado." icon={<CreditCard size={22} />} reverse />
           <ServiceCard images={cambioImages} title="Compra e Venda de Divisas" description="Operações comerciais estáveis de USD, EUR, ZAR e moedas da região. Transações seguras com liquidação imediata por meio de nossa rede física de parceiros e atendimento digital." icon={<Repeat size={22} />} tags={[...SUPPORTED_CURRENCIES]} />
         </div>
 
         {/* PLATAFORMAS SUPORTADAS */}
         <div className="bg-white rounded-3xl p-8 border-2 border-amber-200 shadow-lg">
           <div className="text-center space-y-2 mb-8">
             <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider"><BadgeCheck size={14} /> Parceiros Oficiais</div>
             <h3 className="text-2xl font-black text-[#1a4571] tracking-tight">Plataformas Suportadas</h3>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {SUPPORTED_PLATFORMS.map((plat) => (
               <div key={plat} className="flex items-center justify-between p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl font-bold text-slate-700 shadow-sm hover:border-amber-400 hover:bg-amber-100 hover:shadow-md transition-all duration-300 group">
                 <span className="group-hover:text-[#1a4571] transition-colors">{plat}</span>
                 <ChevronRight size={16} className="text-amber-400 group-hover:translate-x-1 transition-transform" />
               </div>
             ))}
           </div>
         </div>
 
         {/* FAQ */}
         <div className="max-w-3xl mx-auto w-full space-y-4">
           <div className="text-center space-y-3 mb-10">
             <div className="inline-flex items-center gap-2 bg-amber-400 px-5 py-2 rounded-full text-xs font-black text-[#1a4571] shadow-md"><Headphones size={16} /> Perguntas Frequentes</div>
             <h2 className="text-3xl font-black text-[#1a4571] tracking-tight">Tire as suas dúvidas</h2>
           </div>
           {FAQS.map((faq, index) => (
             <FAQItem key={index} question={faq.question} answer={faq.answer} isOpen={openFAQ === index} onToggle={() => setOpenFAQ(openFAQ === index ? null : index)} />
           ))}
         </div>
 
       </main>
 
       {/* RODAPÉ */}
       <footer className="w-full bg-white border-t-2 border-amber-200 py-8 mt-auto">
         <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
           <Link to="/" className="flex items-center gap-2 group">
             <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"><Zap size={18} className="text-[#1a4571]" /></div>
             <span className="font-black text-[#1a4571] text-lg tracking-tight">Nexus Money</span>
           </Link>
           <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Plataforma de Atendimento 100% Segura e Verificada © 2026</p>
         </div>
       </footer>
     </div>
   );
 };
 
 export default Index;