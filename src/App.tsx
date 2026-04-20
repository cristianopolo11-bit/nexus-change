import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index";
import Convert from "./pages/Convert";
import NotFound from "./pages/NotFound";

// Importação do componente Footer
import Footer from "./components/Footer"; 

// Importação das novas páginas
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import About from "./pages/About";
import Register from "./pages/Register";
import Login from "./pages/Login"; 
import Orders from "./pages/Orders";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          {/* Estrutura Flexbox para manter o Footer sempre no fundo */}
          <div className="flex flex-col min-h-screen">
            
            <div className="flex-grow">
              <Routes>
                {/* Página Principal */}
                <Route path="/" element={<Index />} />

                {/* Páginas de Acesso */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Página de Histórico de Ordens */}
                <Route path="/orders" element={<Orders />} />

                {/* Página de Conversão (AJUSTADO: Adicionado suporte ao parâmetro :side) */}
                <Route path="/convert" element={<Convert />} />
                {/* Esta rota abaixo é a mais importante para o seu fluxo atual: */}
                <Route path="/convert/:from/:to/:side" element={<Convert />} />

                {/* Rotas Legais para o Google AdSense */}
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/about" element={<About />} />

                {/* Página 404 - Deve ser sempre a última */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>

            {/* Rodapé visível em todas as rotas */}
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}