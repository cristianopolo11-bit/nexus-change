import { ShieldCheck } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6 text-blue-600">
          <ShieldCheck size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Política de Privacidade</h1>
        </div>

        <div className="prose prose-blue text-gray-600 space-y-6">
          <p>
            Na <strong>Nexus Change</strong>, acessível em nexus-change.vercel.app, uma das nossas principais prioridades é a privacidade dos nossos visitantes. Este documento de Política de Privacidade contém tipos de informações que são coletadas e registradas pela Nexus Change e como as usamos.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">Arquivos de Log</h2>
          <p>
            A Nexus Change segue um procedimento padrão de uso de arquivos de log. Esses arquivos registram os visitantes quando eles visitam websites. As informações coletadas pelos arquivos de log incluem endereços de protocolo de internet (IP), tipo de navegador, Provedor de Serviços de Internet (ISP), carimbo de data e hora, páginas de referência/saída e, possivelmente, o número de cliques.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">Cookies e Web Beacons</h2>
          <p>
            Como qualquer outro website, a Nexus Change utiliza 'cookies'. Esses cookies são usados para armazenar informações, incluindo as preferências dos visitantes e as páginas no website que o visitante acessou ou visitou. As informações são usadas para otimizar a experiência dos usuários, personalizando o conteúdo da nossa página web com base no tipo de navegador dos visitantes e/ou outras informações.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">Google DoubleClick DART Cookie</h2>
          <p>
            O Google é um dos fornecedores terceiros no nosso site. Ele também usa cookies, conhecidos como cookies DART, para veicular anúncios aos visitantes do nosso site com base na sua visita a nexus-change.vercel.app e outros sites na internet.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">Políticas de Privacidade de Terceiros</h2>
          <p>
            A Política de Privacidade da Nexus Change não se aplica a outros anunciantes ou websites. Portanto, aconselhamos que você consulte as respectivas Políticas de Privacidade desses servidores de anúncios de terceiros para obter informações mais detalhadas.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">Consentimento</h2>
          <p>
            Ao utilizar o nosso website, você concorda com a nossa Política de Privacidade e aceita os seus termos.
          </p>
          
          <div className="pt-6 border-t border-gray-100 text-sm text-gray-400">
            Última atualização: {new Date().toLocaleDateString('pt-PT')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;