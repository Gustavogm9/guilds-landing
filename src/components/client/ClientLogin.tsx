import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

export const ClientLogin = () => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      toast.error('Por favor, insira o token de acesso');
      return;
    }

    setIsLoading(true);
    
    // Navigate to portal with token
    navigate(`/portal/cliente?token=${encodeURIComponent(token.trim())}`);
    
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-4">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div>
          <CardTitle className="text-2xl">Portal do Cliente</CardTitle>
          <CardDescription className="mt-2">
            Insira seu token de acesso para visualizar o progresso do seu projeto
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">Token de Acesso</Label>
            <Input
              id="token"
              type="text"
              placeholder="Digite seu token de acesso"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Validando...' : 'Acessar Portal'}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Não possui um token de acesso?{' '}
            <a href="/contato" className="text-primary hover:underline">
              Entre em contato conosco
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};