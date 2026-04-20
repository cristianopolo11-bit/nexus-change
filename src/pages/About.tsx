import { Globe, Zap, Target, ShieldCheck } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sobre a Nexus Change</h1>
          <p className="text-gray-600 leading-relaxed italic">
            "Conectando valores, facilitando negócios em toda Angola."
          </p>
        </div>

        <div className="prose prose-blue text-gray-600 mb-10">
          <p>
            A <strong>Nexus Change</strong> nasceu da necessidade de modernizar e trazer transparência ao mercado de câmbio em <strong>Angola</strong>. Somos mais do que um simples simulador; somos o elo de ligação entre quem precisa de moedas estrangeiras e um atendimento profissional, rápido e seguro.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          {/* Missão */}
          <div className="flex gap-4 p-5 rounded-xl bg-blue-50 border border-blue-100">
            <div className="bg-blue-600 p-3 rounded-lg h-fit text-white shadow-lg">
              <Target size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Nossa Missão em Angola</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Providenciar cotações de câmbio precisas para o mercado angolano, permitindo que qualquer pessoa, em qualquer província, tenha acesso a informações de mercado em tempo real para tomar as melhores decisões.
              </p>
            </div>
          </div>

          {/* Visão/Alcance */}
          <div className="flex gap-4 p-5 rounded-xl bg-green-50 border border-green-100">
            <div className="bg-green-600 p-3 rounded-lg h-fit text-white shadow-lg">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Alcance Nacional</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Do Kwanza ao Dólar ou Euro, o nosso objetivo é servir o país de Cabinda ao Cunene, garantindo que a informação chegue a quem precisa através da ferramenta que todos usam: o telemóvel.
              </p>
            </div>
          </div>

          {/* Diferencial/Tecnologia */}
          <div className="flex gap-4 p-5 rounded-xl bg-amber-50 border border-amber-100">
            <div className="bg-amber-600 p-3 rounded-lg h-fit text-white shadow-lg">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Agilidade no WhatsApp</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Unimos a tecnologia de ponta com o toque humano. O nosso simulador prepara o cliente, mas o nosso atendimento direto via WhatsApp finaliza a negociação com a confiança que apenas uma conversa real pode oferecer.
              </p>
            </div>
          </div>

          {/* Segurança */}
          <div className="flex gap-4 p-5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="bg-slate-700 p-3 rounded-lg h-fit text-white shadow-lg">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Compromisso e Seriedade</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Valorizamos o profissionalismo. Operamos com transparência total nas taxas e oferecemos suporte técnico dedicado para garantir que a experiência de cada cliente seja impecável.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm font-medium">Nexus Change — Soluções Inteligentes para Angola</p>
          <p className="text-gray-400 text-[10px] uppercase tracking-widest mt-2 font-bold">Atendimento 100% Digital e Seguro</p>
        </div>
      </div>
    </div>
  );
};

export default About;