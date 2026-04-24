import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRaioXSession } from '@/hooks/useRaioXSession';
import { RaioXIntro } from '@/components/raiox/intro/RaioXIntro';
import { OnboardingShell } from '@/components/raiox/onboarding/OnboardingShell';
import { ProcessingScreen } from '@/components/raiox/processing/ProcessingScreen';
import { DashboardContainer } from '@/components/raiox/dashboard/DashboardContainer';
import { Loader2, ArrowLeft, LogOut } from 'lucide-react';
import { supabaseRaiox } from '@/lib/supabase-raiox';

type DiagnosticStatus = 'draft' | 'processing' | 'completed' | 'archived' | 'error' | null;

export function RaioX() {
  const { session, user, loading, signOut } = useRaioXSession();
  const [diagnosticStatus, setDiagnosticStatus] = useState<DiagnosticStatus>(null);
  const [loadingDiagnostic, setLoadingDiagnostic] = useState(false);

  useEffect(() => {
    async function checkOrCreateDiagnostic() {
      if (!session?.user) return;
      
      setLoadingDiagnostic(true);
      try {
        const { data, error } = await supabaseRaiox
          .from('diagnostics')
          .select('id, status, current_step')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching diagnostic:", error);
          return;
        }

        if (data) {
          setDiagnosticStatus(data.status as DiagnosticStatus);
        } else {
          // Auto-create draft diagnostic for new users
          const { error: createError } = await supabaseRaiox
            .from('diagnostics')
            .insert({ user_id: session.user.id, status: 'draft', current_step: 1 })
            .select()
            .single();
            
          if (!createError) {
            setDiagnosticStatus('draft');
          }
        }
      } finally {
        setLoadingDiagnostic(false);
      }
    }

    if (session) {
      checkOrCreateDiagnostic();
    } else {
      setDiagnosticStatus(null);
    }
  }, [session]);

  // Polling when processing
  useEffect(() => {
    if (diagnosticStatus !== 'processing' || !session?.user) return;

    const interval = setInterval(async () => {
      const { data, error } = await supabaseRaiox
        .from('diagnostics')
        .select('status')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        if (data.status !== 'processing') {
          setDiagnosticStatus(data.status as DiagnosticStatus);
          clearInterval(interval);
        }
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [diagnosticStatus, session]);

  // --- Loading state ---
  if (loading || loadingDiagnostic) {
    return (
      <div className="min-h-screen bg-[#05070C] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-xs text-slate-600">Carregando diagnóstico...</p>
        </div>
      </div>
    );
  }

  // --- Render content based on state ---
  const renderContent = () => {
    // Not logged in → show intro/auth
    if (!session) {
      return <RaioXIntro />;
    }

    // Logged in → route by diagnostic status
    switch (diagnosticStatus) {
      case 'draft':
        return <OnboardingShell />;
      case 'processing':
        return <ProcessingScreen />;
      case 'completed':
        return (
          <div className="max-w-2xl mx-auto text-center py-24 animate-in fade-in duration-500">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M9 11l3 3L22 4" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="text-3xl font-black font-display text-white mb-4">
              Diagnóstico Concluído
            </h2>
            <p className="text-slate-400 max-w-md mx-auto mb-8">
              Seu relatório Raio-X G-FORGE está pronto. O Dashboard com análise completa, benchmarks 
              e plano de ação personalizado está em desenvolvimento e será liberado em breve.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-300 text-xs font-semibold">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Dashboard em desenvolvimento
            </div>
          </div>
        );
      case 'error':
        return (
          <div className="max-w-lg mx-auto text-center py-24">
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Houve um problema</h2>
            <p className="text-slate-400 text-sm">
              Estamos cientes e tentaremos processar seu diagnóstico novamente em breve. 
              Você receberá um e-mail quando estiver pronto.
            </p>
          </div>
        );
      default:
        return <RaioXIntro />;
    }
  };

  // Se estiver concluído, o DashboardContainer assume a tela inteira com seu próprio layout (DashboardShell)
  if (diagnosticStatus === 'completed') {
    return <DashboardContainer />;
  }

  return (
    <div className="min-h-screen bg-[#05070C] text-slate-200">
      {/* Background grid */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 12% -10%, rgba(59,130,246,0.08), transparent 40%),
            radial-gradient(circle at 100% 10%, rgba(99,102,241,0.05), transparent 35%),
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 28px 28px, 28px 28px'
        }}
      />

      {/* Topbar */}
      <header className="border-b border-white/5 sticky top-0 z-40 backdrop-blur-xl bg-[#05070C]/80">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-6">
          {/* Logo + breadcrumb */}
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="#60A5FA" strokeWidth="2"/>
              <path d="M12 12l9-5M12 12v10M12 12L3 7" stroke="#60A5FA" strokeWidth="2"/>
            </svg>
            <span className="font-display font-black tracking-[0.18em] text-sm">GUILDS</span>
          </Link>
          <span className="text-slate-700 text-xs">/</span>
          <span className="text-slate-400 text-xs font-medium">Raio-X G-FORGE</span>
          
          {/* Status indicator */}
          {session && diagnosticStatus && (
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
              <span className={`w-1.5 h-1.5 rounded-full ${
                diagnosticStatus === 'completed' ? 'bg-green-500' : 
                diagnosticStatus === 'processing' ? 'bg-amber-500 animate-pulse' : 
                'bg-blue-500'
              }`} />
              {diagnosticStatus === 'draft' && 'Em andamento · salvo automaticamente'}
              {diagnosticStatus === 'processing' && 'Processando...'}
              {diagnosticStatus === 'completed' && 'Diagnóstico concluído'}
              {diagnosticStatus === 'error' && 'Erro no processamento'}
            </div>
          )}

          <div className="flex-1" />

          {/* Back to landing */}
          <Link 
            to="/" 
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Voltar ao site
          </Link>

          {/* User info + logout */}
          {session && user && (
            <div className="flex items-center gap-3 pl-4 border-l border-white/5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-300 flex items-center justify-center font-bold text-xs">
                {(user.email?.charAt(0) || 'U').toUpperCase()}
              </div>
              <div className="hidden lg:block text-xs leading-tight">
                <div className="font-semibold text-slate-200 truncate max-w-[120px]">{user.email}</div>
              </div>
              <button 
                onClick={signOut}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-colors"
                title="Sair"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-[1400px] mx-auto px-6 py-8">
        {renderContent()}
      </main>

      {/* Footer minimal */}
      <footer className="border-t border-white/5 py-6 mt-8">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-700">
          <span>© {new Date().getFullYear()} Guilds. Todos os direitos reservados.</span>
          <div className="flex items-center gap-4">
            <Link to="/privacidade" className="hover:text-slate-400 transition-colors">Privacidade</Link>
            <Link to="/termos" className="hover:text-slate-400 transition-colors">Termos de uso</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
