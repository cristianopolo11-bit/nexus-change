import React from "react";
import { ShieldCheck, Globe, Lock, EyeOff, MessageSquare } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-left">
      {/* HEADER CORPORATIVO UNIFICADO */}
      <header className="bg-[#1a4571] py-16 px-6 text-center text-white">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
          Política de Privacidade
        </h1>
        <p className="text-blue-100 max-w-2xl mx-auto font-medium text-sm">
          Saiba como protegemos os seus dados e garantimos o sigilo absoluto em cada transação digital.
        </p>
      </header>

      <div className="max-w-4xl mx-auto px-6 -mt-10">
        {/* BLOCO CENTRAL DE PRIVACIDADE COM ANIMAÇÃO */}
        <section 
          data-aos="fade-up"
          className="bg-white p-8 md:p-12 border-none shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-[2rem] space-y-8 text-slate-600 font-medium text-sm leading-relaxed"
        >
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <ShieldCheck size={36} className="text-[#1a4571]" />
            <h2 className="text-2xl font-black text-[#1a4571] uppercase italic tracking-tight">
              Compromisso de Sigilo
            </h2>
          </div>

          <p className="text-sm md:text-base">
            Na <strong>Nexus Change</strong>, operamos sob o compromisso de servir o mercado financeiro de <strong>Angola</strong> com transparência, integridade e máxima segurança. A privacidade dos nossos utilizadores e a proteção das suas intenções cambiais são os pilares fundamentais do nosso serviço.
          </p>

          {/* Diretriz 1 */}
          <div className="space-y-2">
            <h3 className="text-lg font-black text-[#1a4571] uppercase italic flex items-center gap-2">
              <Globe size={18} /> Operação Financeira Descentralizada
            </h3>
            <p>
              O nosso ecossistema foi projetado para investidores e clientes que procuram agilidade. **Não solicitamos, não processamos e não armazenamos passwords de cartões ou dados bancários sensíveis** neste website. O papel da plataforma é fornecer cotações dinâmicas e estabelecer canais de comunicação diretos e seguros.
            </p>
          </div>

          {/* Diretriz 2 */}
          <div className="space-y-2">
            <h3 className="text-lg font-black text-[#1a4571] uppercase italic flex items-center gap-2">
              <Lock size={18} /> Negociação Assistida e Protegida
            </h3>
            <p>
              Em conformidade com as boas práticas de proteção de dados, a validação e o fecho de qualquer operação cambial ocorrem num ambiente privado e humano. Todas as informações operacionais, dados de liquidação (como chaves de carteiras digitais ou IBAN) e comprovativos partilhados de forma voluntária no atendimento direto são tratados com sigilo absoluto e utilizados estritamente para a execução da ordem solicitada.
            </p>
          </div>

          {/* Diretriz 3 */}
          <div className="space-y-2">
            <h3 className="text-lg font-black text-[#1a4571] uppercase italic flex items-center gap-2">
              <EyeOff size={18} /> Retenção Mínima de Dados
            </h3>
            <p>
              Respeitamos a privacidade do cliente em qualquer localidade. Os cookies utilizados neste portal servem unicamente para fins analíticos anónimos e para garantir que as tuas preferências de moedas e do montante em Kwanza (AOA) sejam mantidas temporariamente durante a simulação, sem rastreio ou armazenamento da tua identidade.
            </p>
          </div>

          {/* Diretriz 4 */}
          <div className="space-y-2">
            <h3 className="text-lg font-black text-[#1a4571] uppercase italic flex items-center gap-2">
              <MessageSquare size={18} /> Canais Oficiais de Atendimento
            </h3>
            <p>
              Para a sua total segurança, realize as suas transações exclusivamente através dos botões oficiais de redirecionamento para o nosso WhatsApp presentes nesta plataforma. A Nexus Change **nunca solicita dados de acesso, códigos de autenticação ou transferências imediatas através de chamadas telefónicas ou links externos não verificados**.
            </p>
          </div>

          {/* Consentimento */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-black text-[#1a4571] uppercase tracking-wider mb-1">Consentimento Informado</h3>
            <p className="text-xs text-slate-500">
              Ao utilizar o portal da Nexus Change para simular cotações cambiais e interagir com os nossos operadores, o utilizador declara estar ciente e de acordo com as nossas diretrizes de segurança, sigilo bancário e tratamento restrito de dados operacionais.
            </p>
          </div>

          {/* Data de Atualização Dinâmica */}
          <div className="pt-2 text-[11px] text-slate-400 font-bold uppercase tracking-widest text-right">
            Última atualização: {new Date().toLocaleDateString('pt-PT')}
          </div>
        </section>

        {/* RODAPÉ ALINHADO */}
        <div data-aos="fade-up" className="mt-12 text-center space-y-1">
          <p className="text-slate-500 text-sm font-black italic uppercase tracking-tight">
            Nexus Change — Segurança Bancária e Inovação
          </p>
          <p className="text-slate-400 text-[10px] uppercase tracking-widest font-black">
            Proteção e Confidencialidade Garantidas
          </p>
        </div>

      </div>
    </div>
  );
};

export default Privacy;