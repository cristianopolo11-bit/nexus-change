import { Globe, Zap, Target } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sobre a Nexus Change</h1>
          <p className="text-gray-600 leading-relaxed">
            A nossa missão é simplificar a forma como o mundo consulta o valor do dinheiro, 
            oferecendo dados precisos e uma experiência intuitiva.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-1">
          {/* Missão */}
          <div className="flex gap-4 p-4 rounded-xl bg-blue-50">
            <div className="bg-blue-600 p-3 rounded-lg h-fit text-white">
              <Target size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Nossa Missão</h3>
              <p className="text-gray-600 text-sm">
                Providenciar conversões de câmbio rápidas e acessíveis para todos, 
                focando especialmente em mercados emergentes e globais.
              </p>
            </div>
          </div>

          {/* Visão */}
          <div className="flex gap-4 p-4 rounded-xl bg-green-50">
            <div className="bg-green-600 p-3 rounded-lg h-fit text-white">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Alcance Global</h3>
              <p className="text-gray-600 text-sm">
                Conectar moedas de todos os continentes, do Kwanza ao Dólar, 
                garantindo que a informação chegue a quem precisa, onde precisar.
              </p>
            </div>
          </div>

          {/* Tecnologia */}
          <div className="flex gap-4 p-4 rounded-xl bg-amber-50">
            <div className="bg-amber-600 p-3 rounded-lg h-fit text-white">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Tecnologia e Rapidez</h3>
              <p className="text-gray-600 text-sm">
                Utilizamos as APIs mais modernas para garantir que os dados sejam 
                atualizados e entregues de forma instantânea no seu navegador.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center text-gray-500 text-sm">
          <p>A Nexus Change é uma ferramenta independente e gratuita.</p>
        </div>
      </div>
    </div>
  );
};

export default About;