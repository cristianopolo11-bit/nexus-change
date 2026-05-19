import React, { useEffect } from "react"; // IMPORTADO O USEEFFECT
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
import Support from "./pages/Support"; // 1. IMPORTAÇÃO DA PÁGINA DE SUPORTE
import Convert from "./pages/Convert";
import NotFound from "./pages/NotFound";

// Páginas de Acesso e Gestão
import Register from "./pages/Register";
import Login from "./pages/Login"; 
import Orders from "./pages/Orders";

// Páginas Legais e Institucionais
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import About from "./pages/About";

const queryClient = new QueryClient();

export default function App() {
  
  // 2. INICIALIZAÇÃO DA MÁQUINA DE ANIMAÇÕES AUTOMÁTICA
  useEffect(() => {
    AOS.init({
      duration: 800,     // Tempo que a animação demora a completar (800ms = rápido e elegante)
      once: true,         // Executa a animação apenas uma vez ao descer o ecrã (evita repetições cansativas)
      easing: "ease-out", // Tipo de movimento suave (desacelera ligeiramente no final)
      offset: 100         // Só dispara a animação quando o elemento estiver a 100px visíveis na tela
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-transparent">
            
            <main className="flex-grow">
              <Routes>
                {/* Rota Principal */}
                <Route path="/" element={<Index />} />

                {/* Rotas de Navegação (Menu Lateral) */}
                <Route path="/buy" element={<Buy />} />
                <Route path="/sell" element={<Sell />} /> 
                <Route path="/services" element={<Services />} /> 
                <Route path="/support" element={<Support />} /> {/* 2. ROTA DE SUPORTE ADICIONADA */}

                {/* Fluxo de Checkout dinâmico */}
                <Route path="/convert/:from/:to/:type" element={<Convert />} />
                <Route path="/convert" element={<Convert />} />
                
                <Route path="/orders" element={<Orders />} />

                {/* Autenticação e Restante das Páginas */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />

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