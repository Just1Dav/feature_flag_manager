// src/components/react/AuthForm/LoginForm.tsx

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const defaultErrorMessage = 'Ocorreu um erro ao tentar realizar login';

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || defaultErrorMessage);
      }

      toast.success('Login realizado com sucesso!');

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 300);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : defaultErrorMessage);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <InputGroup className="h-11">
          <InputGroupInput id="login-email" name="email" placeholder="seu@email.com" type="email" required />
          <InputGroupAddon>
            <Mail className="text-muted-foreground h-5 w-5" />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">Senha</Label>
        <InputGroup className="h-11">
          <InputGroupInput id="login-password" name="password" type="password" placeholder="••••••••" required />
          <InputGroupAddon>
            <Lock className="text-muted-foreground h-5 w-5" />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <Button
        type="submit"
        className="bg-primary hover:bg-primary/90 mt-4 h-11 w-full text-base font-medium"
        disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando...
          </>
        ) : (
          'Entrar'
        )}
      </Button>
    </form>
  );
}
