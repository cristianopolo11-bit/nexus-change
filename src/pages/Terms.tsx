import { FileText, AlertTriangle, ShieldCheck } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6 text-blue-600">
          <FileText size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Termos de Uso</h1>
        </div>

        <div className="prose prose-blue text-gray-600 space-y-6">
          <p>
            Bem-vindo à <strong>Nexus Change</strong>. Ao aceder a este website e utilizar o nosso simulador para o mercado de <strong>Angola</strong>, presumimos que aceitas estes termos e condições na íntegra.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-500" />
            Natureza do Serviço
          </h2>
          <p>
            A Nexus Change é uma plataforma digital de simulação e facilitação de contacto. É importante compreender que:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Simulador de Taxas:</strong> As taxas de câmbio apresentadas são informativas e baseadas nas flutuações do mercado angolano. O valor real da operação será confirmado apenas durante o atendimento direto.</li>
            <li><strong>Fecho de Negócio:</strong> Este website não processa pagamentos nem transferências bancárias. Todas as transações financeiras são concluídas exclusivamente via WhatsApp ou contacto telefónico com os nossos operadores oficiais.</li>
            <li><strong>Disponibilidade:</strong> As operações de câmbio estão sujeitas à disponibilidade de stock no momento da negociação em Angola.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <ShieldCheck size={20} className="text-green-600" />
            Responsabilidade do Utilizador
          </h2>
          <p>
            Ao utilizar o nosso serviço em Angola, o utilizador declara que:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>As informações fornecidas para a simulação são verdadeiras.</li>
            <li>Compreende que as taxas de câmbio podem variar entre o momento da simulação no site e o momento do contacto real.</li>
            <li>É responsável por verificar se a operação pretendida cumpre com as suas necessidades financeiras pessoais.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800">Propriedade Intelectual</h2>
          <p>
            Todo o material presente na Nexus Change (logotipo, design e simulador) é propriedade do projeto. O uso indevido da marca Nexus Change para fins comerciais não autorizados em território angolano é estritamente proibido.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">Canais Oficiais e Segurança</h2>
          <p>
            Para tua segurança, a Nexus Change apenas reconhece negociações feitas através dos nossos números oficiais terminados em <strong>514</strong> e <strong>291</strong>. Não nos responsabilizamos por contactos feitos através de terceiros que se façam passar pela nossa marca.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">Alterações</h2>
          <p>
            Reservamos o direito de atualizar estas regras sempre que necessário para melhor servir o mercado em Angola. O uso continuado do site após alterações implica a aceitação dos novos termos.
          </p>
          
          <div className="pt-6 border-t border-gray-100 text-sm text-gray-400">
            Última atualização: {new Date().toLocaleDateString('pt-PT')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;