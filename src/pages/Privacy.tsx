import { ShieldCheck, Globe } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6 text-blue-600">
          <ShieldCheck size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Privacidade e Segurança</h1>
        </div>

        <div className="prose prose-blue text-gray-600 space-y-6">
          <p>
            Na <strong>Nexus Change</strong>, operamos com o compromisso de servir todo o território de <strong>Angola</strong> com transparência e segurança. A privacidade dos nossos utilizadores é o pilar fundamental do nosso serviço de câmbio.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Globe size={20} className="text-blue-500" /> Operação Nacional (Angola)
          </h2>
          <p>
            O nosso serviço é desenhado para angolanos que procuram agilidade. Não solicitamos nem armazenamos dados bancários sensíveis ou senhas neste website. O nosso papel é fornecer cotações atualizadas para o mercado angolano e facilitar o contacto direto.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">Negociação Segura no WhatsApp</h2>
          <p>
            Como é prática comum no mercado digital em Angola, a negociação final é realizada via WhatsApp. Todas as informações partilhadas durante a conversa são protegidas pela criptografia da plataforma e utilizadas estritamente para a finalidade da operação de câmbio.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">Proteção de Dados em Angola</h2>
          <p>
            Respeitamos a privacidade dos nossos clientes em todas as províncias. Os cookies utilizados neste portal servem apenas para garantir que as tuas preferências de moeda (como o Kwanza - AOA) sejam mantidas durante a navegação.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">Canais Oficiais</h2>
          <p>
            Para garantir a tua segurança, certifica-te de que estás a comunicar com os nossos números oficiais angolanos (terminados em <strong>514</strong> e <strong>291</strong>). A Nexus Change nunca solicita dados de acesso por telefone.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">Consentimento</h2>
          <p>
            Ao utilizar o nosso portal para simular taxas de câmbio em Angola, declaras estar de acordo com as nossas práticas de segurança e sigilo profissional.
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