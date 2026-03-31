import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index";
import Convert from "./pages/Convert";
import NotFound from "./pages/NotFound";

// React Query client (used for caching API requests)
const queryClient = new QueryClient();

export default function App() {

  return (

    <QueryClientProvider client={queryClient}>

      <TooltipProvider>

        {/* Notifications */}
        <Toaster />
        <Sonner />

        {/* Router */}

        <BrowserRouter>

          <Routes>

            {/* Home page */}
            <Route path="/" element={<Index />} />

            {/* Dynamic currency converter pages */}
            {/* Example:
                /convert/usd/aoa
                /convert/eur/ngn
                /convert/gbp/zar
            */}

            <Route path="/convert/:from/:to" element={<Convert />} />

            {/* Catch all → 404 page */}
            <Route path="*" element={<NotFound />} />

          </Routes>

        </BrowserRouter>

      </TooltipProvider>

    </QueryClientProvider>

  );

}
