import React, { useEffect } from "react"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// 1. IMPORTAÇÃO DO AOS (ANIMATE ON SCROLL) E DOS SEUS ESTILOS
import AOS from "aos";
import "aos/dist/aos.css";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Páginas Principais
import Index from "./pages/Index";
import Buy from "./pages/Buy"; 
import Sell from "./pages/Sell"; 
import Services from "./pages/Services"; 
import Support from "./pages/Support"; 
import Convert from "./pages/Convert";
import Transfer from "./pages/Transfer"; // INJETADO: Nova página de transferências
import NotFound from "./pages/NotFound";

// Páginas de Acesso e Gestão
import Register from "./pages/Register";
import Login from "./pages/Login"; 
import Orders from "./pages/Orders";

// Páginas Legais e Institucionais
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import About from "./pages/About";
import FAQ from "./pages/FAQ";

// NOVO: Importação padrão para compatibilidade total com o Vite/Lovable
import AdminChat from "./pages/AdminChat";

const queryClient = new QueryClient();

export default function App() {
  
  // 2. INICIALIZAÇÃO DA MÁQUINA DE ANIMAÇÕES E TRADUTOR AUTOMÁTICO
  useEffect(() => {
    // Inicializa animações de scroll
    AOS.init({
      duration: 800,     // Tempo que a animação demora a completar (800ms = rápido e elegante)
      once: true,         // Executa a animação apenas uma vez ao descer o ecrã
      easing: "ease-out", // Tipo de movimento suave
      offset: 100         // Só dispara a animação quando o elemento estiver a 100px visíveis
    });

    // SISTEMA DE TRADUÇÃO: Carrega o Google Translate automaticamente baseado no idioma do utilizador
    const initGoogleTranslate = () => {
      if (document.getElementById("google-translate-script")) return;

      // Configuração global exigida pela API do Google
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "pt", // Idioma base do teu desenvolvimento
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: true  // Força a tradução caso o navegador esteja noutro idioma
          },
          "google_translate_element"
        );
      };

      // Injeta a tag script oficial do tradutor de forma assíncrona
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    initGoogleTranslate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-transparent">
            
            {/* Elemento oculto necessário para o funcionamento interno do motor do Google Translate */}
            <div id="google_translate_element" className="hidden"></div>

            <main className="flex-grow">
              <Routes>
                {/* Rota Principal */}
                <Route path="/" element={<Index />} />

                {/* Rotas de Navegação (Menu Lateral) */}
                <Route path="/buy" element={<Buy />} />
                <Route path="/sell" element={<Sell />} /> 
                <Route path="/services" element={<Services />} /> 
                <Route path="/support" element={<Support />} /> 
                <Route path="/transfer" element={<Transfer />} /> {/* INJETADO: Rota do formulário de transferências */}

                {/* Fluxo de Checkout dinâmico */}
                <Route path="/convert/:from/:to/:type" element={<Convert />} />
                <Route path="/convert" element={<Convert />} />
                
                <Route path="/orders" element={<Orders />} />

                {/* Autenticação e Restante das Páginas */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />

                {/* NOVO: Rota Secreta da Mesa de Negociação para os Operadores */}
                <Route path="/nexus-admin-chat" element={<AdminChat />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}