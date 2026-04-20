import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-card border-t border-foreground/5 py-12 px-4">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
        
        {/* LINKS DE NAVEGAÇÃO - Recuperando o "Sobre Nós" */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <button 
            onClick={() => navigate("/about")} 
            className="text-[11px] font-black uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors"
          >
            Sobre Nós
          </button>
          <button 
            onClick={() => navigate("/privacy")} 
            className="text-[11px] font-black uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors"
          >
            Privacidade
          </button>
          <button 
            onClick={() => navigate("/terms")} 
            className="text-[11px] font-black uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors"
          >
            Termos
          </button>
        </div>

        {/* LOGO E COPYRIGHT */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 opacity-20">
            <img src="/icon.png" alt="Nexus" className="w-5 h-5 grayscale" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Nexus Change — Angola</span>
          </div>
          <p className="text-[9px] font-medium text-foreground/10 uppercase tracking-widest">
            © {year} Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;