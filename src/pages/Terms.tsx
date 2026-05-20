import React from "react";
import { FileText, AlertTriangle, ShieldCheck, Scale, HelpCircle } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-left">
      {/* HEADER CORPORATIVO UNIFICADO */}
      <header className="bg-[#1a4571] py-16 px-6 text-center text-white">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
          Termos de Uso
        </h1>
        <p className="text-blue-100 max-w-2xl mx-auto font-medium text-sm">
          Por favor, leia atentamente as condições e diretrizes para a utilização segura da nossa plataforma.
        </p>
      </header>

      <div className="max-w-4xl mx-auto px-6 -mt-10">
        {/* BLOCO CENTRAL DE TERMOS COM ANIMAÇÃO */}
        <section 
          data-aos="fade-up"
          className="bg-white p-8 md:p-12 border-none shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-white rounded-[2rem] space-y-8 text-slate-600 font-medium text-sm leading-relaxed"
        >
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <FileText size={36} className="text-[#1a4571]" />
            <h2 className="text-2xl font-black text-[#1a4571] uppercase italic tracking-tight">
              Regulamento Operacional
            </h2>
          </div>

          <p className="text-sm md:text-base">
            Bem-vindo à <strong>Nexus Change</strong>. Ao aceder a este portal e utilizar as nossas ferramentas de simulação inteligente para o mercado cambial de <strong>Angola</strong>, o utilizador declara estar ciente e aceitar integralmente os presentes Termos e Condições de Uso.
          </p>

          {/* Diretriz 1 */}
          <div className="space-y-3">
            <h3 className="text-lg font-black text-[#1a4571] uppercase italic flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" /> Natureza Informativa do Simulador
            </h3>
            <p>
              A Nexus Change disponibiliza um ecossistema digital focado na simulação e facilitação de intermediação financeira. É expressamente estipulado que:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-500 text-xs">
              <li><strong className="text-slate-600">Simulador Dinâmico:</strong> As taxas de câmbio apresentadas no portal servem como referência de mercado em tempo real. O valor exato e definitivo da operação será fixado apenas no momento da negociação direta.</li>
              <li><strong className="text-slate-600">Fecho de Operações:</strong> Este website funciona como uma interface de preparação e triagem. Nenhuma transferência financeira ou processamento automático de liquidação local ocorre neste domínio; todas as transações são concluídas de forma privada e segura através do nosso chat assistido.</li>
              <li><strong className="text-slate-600">Disponibilidade de Liquidez:</strong> A execução das ordens de compra e venda de divisas ou ativos digitais está estritamente condicionada aos limites de stock e liquidez da plataforma no momento da validação do operador.</li>
            </ul>
          </div>

          {/* Diretriz 2 */}
          <div className="space-y-3">
            <h3 className="text-lg font-black text-[#1a4571] uppercase italic flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-500" /> Responsabilidades do Utilizador
            </h3>
            <p>
              Ao utilizar as ferramentas da nossa plataforma em território nacional, o utilizador assume e declara que:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-500 text-xs">
              <li>Todos os montantes introduzidos e dados preenchidos refletem uma intenção operacional verídica e legítima.</li>
              <li>Compreende a volatilidade das taxas cambiais e aceita que valores simulados podem sofrer atualizações devido a flutuações de mercado até ao momento do contacto efetivo.</li>
              <li>É o único responsável por garantir que os seus dados de liquidação externos fornecidos ao operador estão corretos.</li>
            </ul>
          </div>

          {/* Diretriz 3 */}
          <div className="space-y-2">
            <h3 className="text-lg font-black text-[#1a4571] uppercase italic flex items-center gap-2">
              <Scale size={18} /> Propriedade Intelectual e Uso de Marca
            </h3>
            <p>
              Todo o material digital incorporado na Nexus Change — incluindo a arquitetura do simulador, identidade visual, logótipos e códigos estruturais — é propriedade exclusiva do projeto. Qualquer reprodução, cópia ou engenharia reversa não autorizada para fins comerciais em Angola está sujeita a medidas legais protetivas.
            </p>
          </div>

          {/* Diretriz 4 */}
          <div className="space-y-2">
            <h3 className="text-lg font-black text-[#1a4571] uppercase italic flex items-center gap-2">
              <HelpCircle size={18} /> Segurança de Canais e Intermediação
            </h3>
            <p>
              Para resguardar os seus fundos, realize as suas transações única e exclusivamente através do painel de chat encriptado integrado nativamente neste domínio oficial. A Nexus Change declina qualquer tipo de responsabilidade por perdas ou negociações efetuadas através de terceiros ou em plataformas externas não validadas pela nossa marca.
            </p>
          </div>

          {/* Alterações */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black text-[#1a4571] uppercase tracking-wider mb-1">Atualizações e Jurisdição</h3>
            <p className="text-xs text-slate-500">
              Reservamo-nos o direito de modificar ou otimizar estes termos regulamentares sempre que necessário para acompanhar exigências de mercado ou atualizações técnicas na nossa infraestrutura digital. O uso continuado da plataforma pressupõe a aceitação tácita das normas vigentes.
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
            Nexus Change — Termos Legais de Utilização
          </p>
          <p className="text-slate-400 text-[10px] uppercase tracking-widest font-black">
            Navegação Regulada e Transparência Matemática
          </p>
        </div>

      </div>
    </div>
  );
};

export default Terms;