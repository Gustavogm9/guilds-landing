import { useState } from 'react';
import { supabaseRaiox } from '@/lib/supabase-raiox';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export function RaioXAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabaseRaiox.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo ao diagnóstico G-FORGE.",
        });
      } else {
        const { error } = await supabaseRaiox.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        toast({
          title: "Login realizado com sucesso!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro de autenticação",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-[#0B1120] border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-display tracking-tight text-white mb-2">
            {isSignUp ? 'Criar sua conta' : 'Acessar seu diagnóstico'}
          </h2>
          <p className="text-sm text-slate-400">
            {isSignUp 
              ? 'Comece o Raio-X G-FORGE e descubra o custo da sua ineficiência.' 
              : 'Bem-vindo de volta. Continue de onde parou.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">E-mail corporativo</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="email"
                type="email"
                placeholder="voce@suaempresa.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 bg-slate-900/50 border-white/10 focus:border-blue-500 text-white placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-slate-300">Senha</Label>
              {!isSignUp && (
                <button type="button" className="text-xs text-blue-400 hover:text-blue-300 hover:underline">
                  Esqueci minha senha
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10 bg-slate-900/50 border-white/10 focus:border-blue-500 text-white placeholder:text-slate-600"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white mt-6 h-11"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            {isSignUp ? 'Começar Diagnóstico' : 'Entrar'}
            {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          {isSignUp ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-2 text-blue-400 hover:text-blue-300 font-medium hover:underline"
          >
            {isSignUp ? 'Fazer login' : 'Criar conta grátis'}
          </button>
        </div>
      </div>
    </div>
  );
}
