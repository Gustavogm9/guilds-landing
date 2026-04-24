import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabaseRaiox } from '@/lib/supabase-raiox';
import { Loader2, AlertCircle } from 'lucide-react';
import { DashboardShell } from '@/components/raiox/dashboard/DashboardShell';
import { MOCK_DASHBOARD_DATA } from '@/components/raiox/dashboard/mockData';

export function RaioXShared() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diagnosticId, setDiagnosticId] = useState<string | null>(null);

  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setError('Token não fornecido.');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabaseRaiox.functions.invoke('raiox-public-view', {
          body: { token }
        });

        if (error || !data?.success) {
          throw new Error('Link inválido ou expirado.');
        }

        setDiagnosticId(data.diagnosticId);
        setDashboardData(data.dashboardData);
      } catch (err: any) {
        console.error('Validation error:', err);
        setError('Este link expirou ou não é mais válido.');
      } finally {
        setLoading(false);
      }
    }

    validateToken();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070C] flex flex-col items-center justify-center text-slate-200">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-sm text-slate-400">Carregando relatório seguro...</p>
      </div>
    );
  }

  if (error || !diagnosticId || !dashboardData) {
    return (
      <div className="min-h-screen bg-[#05070C] flex flex-col items-center justify-center text-slate-200 p-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Acesso Indisponível</h2>
        <p className="text-slate-400 text-center max-w-md mb-8">{error || 'Relatório não encontrado.'}</p>
        <Link 
          to="/"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          Conheça o Raio-X G-FORGE
        </Link>
      </div>
    );
  }

  return <DashboardShell data={dashboardData} />;
}
