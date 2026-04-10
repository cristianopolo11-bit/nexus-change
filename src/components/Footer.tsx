import { ShieldCheck, FileText, Info } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 mt-20 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Copyright e Nome */}
          <div className="text-gray-600 text-sm font-medium">
            © {currentYear} Nexus Change. Todos os direitos reservados.
          </div>

          {/* Links Legais - Essencial para o AdSense */}
          <div className="flex flex-wrap justify-center gap-6">
            <Link 
              to="/privacy" 
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              <ShieldCheck size={16} />
              Privacidade
            </Link>
            
            <Link 
              to="/terms" 
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              <FileText size={16} />
              Termos de Uso
            </Link>

            <Link 
              to="/about" 
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Info size={16} />
              Sobre Nós
            </Link>
          </div>
        </div>

        {/* Pequeno Disclaimer (Bom para SEO e Transparência) */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">
            As taxas de câmbio são apenas para fins informativos. <br />
            Nexus Change não realiza transações financeiras.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;