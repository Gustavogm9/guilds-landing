import { useEffect, useState } from 'react';
import { supabaseRaiox } from '@/lib/supabase-raiox';
import { useRaioXSession } from '@/hooks/useRaioXSession';
import { Loader2, ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Lead {
  id: string;
  created_at: string;
  status: string;
  user_id: string;
}

export function RaioXAdminLeads() {
  const { session, loading: sessionLoading } = useRaioXSession();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      if (!session?.access_token) return;

      try {
        setLoading(true);
        const { data, error } = await supabaseRaiox.functions.invoke('raiox-admin-leads', {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });

        if (error || !data?.success) {
          throw new Error(data?.error || 'Acesso negado');
        }

        setLeads(data.leads || []);
      } catch (err: any) {
        console.error('Error fetching leads:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (!sessionLoading) {
      if (!session) {
        setError('Você precisa estar logado como administrador para ver esta página.');
        setLoading(false);
      } else {
        fetchLeads();
      }
    }
  }, [session, sessionLoading]);

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen bg-[#05070C] flex flex-col items-center justify-center text-slate-200">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-sm text-slate-400">Verificando credenciais...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#05070C] flex flex-col items-center justify-center text-slate-200 p-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Acesso Restrito</h2>
        <p className="text-slate-400 text-center max-w-md mb-8">{error}</p>
        <Link 
          to="/raio-x"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          Ir para meu Raio-X
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070C] text-slate-200">
      <header className="border-b border-white/5 sticky top-0 z-40 backdrop-blur-xl bg-[#05070C]/80">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Guilds CRM</h1>
            <p className="text-xs text-slate-400 mt-1">Leads do Raio-X G-FORGE</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>{leads.length} leads no pipeline</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1E293B] text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Data</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Diagnostic ID</th>
                <th className="p-4 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-300">
                    {new Date(lead.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-4 text-sm">
                    <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      lead.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                      lead.status === 'processing' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-slate-500/10 text-slate-400'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-mono text-slate-500">
                    {lead.id}
                  </td>
                  <td className="p-4 text-right">
                    {lead.status === 'completed' && (
                      <button 
                        onClick={async () => {
                          try {
                            const { data, error } = await supabaseRaiox.functions.invoke('raiox-share-link', {
                              body: { diagnosticId: lead.id }
                            });
                            if (data?.token) {
                              window.open(`/raio-x/share/${data.token}`, '_blank');
                            } else {
                              alert('Erro ao gerar token');
                            }
                          } catch (err) {
                            alert('Erro de conexão ao gerar token');
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-semibold rounded transition-colors"
                      >
                        Ver Dossiê <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {leads.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 text-sm">
                    Nenhum lead encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
