import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle, XCircle, Download, ArrowLeft, Shield } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Pegamos o whatsapp que salvamos no checkout
  const userWhatsapp = localStorage.getItem('nexus_user_whatsapp');

  useEffect(() => {
    async function fetchOrders() {
      if (!userWhatsapp) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('client_whatsapp', userWhatsapp) // Filtra apenas as ordens DESTE cliente
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao buscar ordens:", error);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    }

    fetchOrders();
  }, [userWhatsapp]);

  return (
    <div className="min-h-svh bg-background text-foreground p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between pt-4">
          <button 
            onClick={() => navigate("/")} 
            className="p-3 bg-foreground/5 rounded-2xl active:scale-90 transition hover:bg-foreground/10"
          >
            <ArrowLeft size={20}/>
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">Minhas Operações</h1>
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em] block">Status em Tempo Real</span>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 font-black uppercase italic opacity-20 animate-pulse tracking-widest">
            Sincronizando com Nexus...
          </div>
        ) : !userWhatsapp || orders.length === 0 ? (
          <div className="bg-card rounded-[3rem] p-12 border border-foreground/5 text-center space-y-6 shadow-xl">
            <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto opacity-20">
              <Clock size={32} />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase opacity-30 tracking-widest">Nenhuma atividade encontrada</p>
              <p className="text-xs text-foreground/50">As tuas operações aparecerão aqui após o checkout.</p>
            </div>
            <button 
              onClick={() => navigate("/")} 
              className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase italic text-xs shadow-lg shadow-primary/20"
            >
              Iniciar Câmbio
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-card p-8 rounded-[2.5rem] border border-foreground/5 shadow-2xl space-y-6 relative overflow-hidden group hover:border-primary/20 transition-all">
                
                {/* Status Bar */}
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase opacity-30 tracking-widest">
                    {new Date(order.created_at).toLocaleDateString()} • {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase italic tracking-widest border ${
                    order.status === 'Concluído' 
                      ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                      : 'bg-primary/10 text-primary border-primary/20 animate-pulse'
                  }`}>
                    {order.status === 'Concluído' ? <CheckCircle size={10}/> : <Clock size={10}/>}
                    {order.status}
                  </div>
                </div>

                {/* Info de Valores */}
                <div className="grid grid-cols-2 gap-4 py-6 border-y border-foreground/5">
                  <div>
                    <p className="text-[9px] font-black uppercase opacity-30 mb-1">Tu Enviaste</p>
                    <p className="text-xl font-black italic tracking-tighter opacity-70">{order.amount_sent}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black uppercase text-primary opacity-60 mb-1 tracking-widest">Tu Recebes</p>
                    <p className="text-2xl font-black italic tracking-tighter text-primary">{order.amount_to_receive}</p>
                  </div>
                </div>

                {/* Rodapé do Card */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 opacity-30">
                    <Shield size={12} className="text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-tighter">ID: {order.id.slice(0,8)}</span>
                  </div>
                  
                  {/* Se o seu irmão já pagou e anexou o comprovativo, o cliente baixa aqui */}
                  {order.status === 'Concluído' && order.brother_receipt_url && (
                    <button 
                      onClick={() => window.open(order.brother_receipt_url, '_blank')} 
                      className="px-6 py-3 bg-foreground text-white rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center gap-2 hover:bg-primary transition-colors shadow-xl shadow-black/10"
                    >
                      <Download size={14} /> Recibo Nexus
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <footer className="py-10 text-center opacity-20">
          <p className="text-[9px] font-black uppercase tracking-[0.5em]">Nexus Change • Hub de Operações Privadas</p>
        </footer>
      </div>
    </div>
  );
}