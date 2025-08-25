import React, { useState, useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, signUp, isAuthenticated, loading: authLoading } = useAuth();
  const location = useLocation();

  // Get the intended destination from navigation state
  const from = location.state?.from?.pathname || '/admin';

  // Redirect if already authenticated
  if (!authLoading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    
    try {
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);
      
      if (!error && isLogin) {
        // Successful login will be handled by auth state change
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
  };

  return (
    <>
      <SEOHead
        title={isLogin ? "Login Admin" : "Cadastro Admin"}
        description="Acesso administrativo ao painel de controle da Guilds"
        noIndex
      />
      
      <div className="min-h-screen bg-guild-hero flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Back to home link */}
          <div className="mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao site
            </Link>
          </div>

          <Card className="card-elevated">
            <CardHeader className="space-y-2 text-center">
              <div className="mx-auto w-12 h-12 bg-guild-gold rounded-xl flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              </div>
              
              <CardTitle className="text-2xl font-sora">
                {isLogin ? 'Acesso Admin' : 'Cadastro Admin'}
              </CardTitle>
              
              <CardDescription>
                {isLogin 
                  ? 'Entre com suas credenciais para acessar o painel'
                  : 'Crie uma conta administrativa'
                }
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@guilds.com.br"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-hero"
                  disabled={isLoading || !email || !password}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      {isLogin ? 'Entrando...' : 'Cadastrando...'}
                    </div>
                  ) : (
                    isLogin ? 'Entrar' : 'Cadastrar'
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <Separator className="my-4" />
                
                <div className="text-center text-sm text-muted-foreground">
                  {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                  {' '}
                  <button
                    onClick={toggleMode}
                    className="text-primary hover:underline font-medium"
                    disabled={isLoading}
                  >
                    {isLogin ? 'Cadastre-se' : 'Faça login'}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Sistema administrativo da Guilds
              <br />
              Acesso restrito a administradores
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;