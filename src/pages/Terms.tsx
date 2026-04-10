import { FileText, AlertTriangle } from "lucide-react";

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
            Bem-vindo à <strong>Nexus Change</strong>. Ao acessar este website, presumimos que você aceita estes termos e condições na íntegra. Não continue a usar o site se você não concordar com todos os termos e condições estabelecidos nesta página.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-500" />
            Isenção de Responsabilidade
          </h2>
          <p>
            As informações fornecidas pela Nexus Change são apenas para fins informativos gerais. Todas as taxas de câmbio são obtidas de APIs públicas e podem sofrer atrasos ou imprecisões devido à volatilidade do mercado financeiro.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Não somos uma corretora:</strong> A Nexus Change não realiza transações financeiras, transferências de dinheiro ou venda de moedas.</li>
            <li><strong>Risco do Usuário:</strong> Qualquer decisão financeira tomada com base nas informações deste site é de inteira responsabilidade do usuário. Recomendamos sempre consultar uma instituição bancária oficial antes de realizar operações reais.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800">Licença de Uso</h2>
          <p>
            Salvo indicação em contrário, a Nexus Change detém os direitos de propriedade intelectual de todo o material no site. Você pode visualizar e imprimir páginas para seu uso pessoal, sujeito às restrições definidas nestes termos.
          </p>
          <p className="font-medium text-gray-700">Você não deve:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Republicar material deste site sem atribuição.</li>
            <li>Vender, alugar ou sublicenciar material do site.</li>
            <li>Reproduzir, duplicar ou copiar material para fins comerciais escusos.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800">Links de Terceiros</h2>
          <p>
            Nosso site pode conter links para sites de terceiros ou serviços que não são de propriedade ou controlados pela Nexus Change. Não temos controle e não assumimos responsabilidade pelo conteúdo ou políticas de privacidade de quaisquer sites de terceiros.
          </p>

          <h2 className="text-xl font-semibold text-gray-800">Alterações nos Termos</h2>
          <p>
            Reservamos o direito de modificar estes termos a qualquer momento. Ao continuar a acessar o nosso site após essas revisões, você concorda em seguir os termos alterados.
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