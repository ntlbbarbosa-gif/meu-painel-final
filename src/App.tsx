import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import Sites from "./pages/Sites";
import Clientes from "./pages/Clientes";
import Pagamentos from "./pages/Pagamentos";
import Configuracoes from "./pages/Configuracoes";
import SiteBloqueado from "./pages/SiteBloqueado";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Página pública de bloqueio - sem layout */}
          <Route path="/bloqueado" element={<SiteBloqueado />} />
          
          {/* Rotas do painel admin */}
          <Route element={<MainLayout><Index /></MainLayout>} path="/" />
          <Route element={<MainLayout><Sites /></MainLayout>} path="/sites" />
          <Route element={<MainLayout><Clientes /></MainLayout>} path="/clientes" />
          <Route element={<MainLayout><Pagamentos /></MainLayout>} path="/pagamentos" />
          <Route element={<MainLayout><Configuracoes /></MainLayout>} path="/configuracoes" />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
