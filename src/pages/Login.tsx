import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Verifica se o número existe na tabela profiles
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("whatsapp", whatsapp)
      .single();

    if (error || !data) {
      alert("Número não encontrado. Verifique se digitou corretamente ou crie uma conta.");
    } else {
      // Guarda o "carimbo" de que ele está logado
      localStorage.setItem('nexus_user_registered', 'true');
      alert(`Bem-vindo de volta, ${data.full_name}!`);
      navigate("/"); 
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-3xl border border-foreground/5 shadow-xl">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold italic tracking-tighter uppercase text-primary">Nexus Login</h2>
          <p className="text-sm text-foreground/50">Introduza o seu WhatsApp para entrar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-bold uppercase text-foreground/40 ml-1">WhatsApp / Telefone</label>
            <input 
              required 
              placeholder="9xx xxx xxx"
              className="w-full h-12 bg-foreground/5 rounded-xl px-4 focus:outline-none focus:ring-1 focus:ring-primary"
              onChange={(e) => setWhatsapp(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition active:scale-95"
          >
            {loading ? "A entrar..." : "Entrar na Conta"}
          </button>

          <p className="text-center text-xs text-foreground/40 mt-4">
            Ainda não tem conta? <Link to="/register" className="text-primary font-bold underline">Registe-se aqui</Link>
          </p>
        </form>
      </div>
    </div>
  );
}