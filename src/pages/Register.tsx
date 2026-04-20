import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Ou usa o teu sistema de alert

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    whatsapp: "",
    email: "",
    password: "", // Adicionámos senha para o Auth
  });
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Criar o utilizador no Supabase Auth
      // Isso dispara automaticamente o e-mail de confirmação que configuraste
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password || "nexus123", // Senha temporária se não pedires no form
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Agora sim, inserimos na tua tabela 'profiles' usando o ID gerado pelo Auth
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            { 
              id: authData.user.id, // O Vínculo crucial
              full_name: formData.full_name, 
              whatsapp: formData.whatsapp,
              email: formData.email 
            }
          ]);

        if (profileError) throw profileError;

        // 3. Sucesso: Guardamos o estado local e avisamos sobre o e-mail
        localStorage.setItem('nexus_user_registered', 'true');
        localStorage.setItem('nexus_user_name', formData.full_name);
        
        alert("Registo feito! Enviámos um link para o teu e-mail. Por favor, confirma para ativar a conta.");
        navigate("/"); 
      }
    } catch (error: any) {
      console.error("Erro no registo:", error.message);
      alert("Erro: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-[2.5rem] border border-foreground/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase text-primary">Nexus Registo</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Segurança de nível bancário</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-foreground/40 ml-1 italic tracking-widest">Nome Completo</label>
            <input 
              required 
              placeholder="Ex: Cristiano Polo"
              className="w-full h-14 bg-foreground/[0.03] border border-foreground/5 rounded-2xl px-5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-foreground transition-all" 
              onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-foreground/40 ml-1 italic tracking-widest">WhatsApp de Angola</label>
            <input 
              required 
              type="tel"
              placeholder="9xx xxx xxx"
              className="w-full h-14 bg-foreground/[0.03] border border-foreground/5 rounded-2xl px-5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-foreground transition-all"
              onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-foreground/40 ml-1 italic tracking-widest">E-mail para Ativação</label>
            <input 
              required 
              type="email"
              placeholder="seu@email.com"
              className="w-full h-14 bg-foreground/[0.03] border border-foreground/5 rounded-2xl px-5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-foreground transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-foreground/40 ml-1 italic tracking-widest">Senha de Acesso</label>
            <input 
              required 
              type="password"
              placeholder="••••••••"
              className="w-full h-14 bg-foreground/[0.03] border border-foreground/5 rounded-2xl px-5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-foreground transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-5 bg-primary text-primary-foreground rounded-[1.5rem] font-black uppercase italic hover:scale-[1.02] transition-all active:scale-95 shadow-xl shadow-primary/20 disabled:opacity-50 mt-4"
          >
            {loading ? "A Criar Conta Nexus..." : "Confirmar e Entrar"}
          </button>
        </form>
        
        <p className="text-center text-[9px] font-bold text-foreground/20 uppercase tracking-[0.2em] pt-4">
          Ao registar, aceita os nossos termos de segurança.
        </p>
      </div>
    </div>
  );
}