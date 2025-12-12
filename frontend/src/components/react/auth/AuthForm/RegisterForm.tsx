import React, { useState } from 'react';
import { toast } from 'sonner';
import { Mail, Lock, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const defaultErrorMessage = 'Ocorreu um erro ao tentar cadastrar';

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    if (data.password !== data.confirmPassword) {
      toast.error('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || defaultErrorMessage);
      }

      toast.success('Conta criada com sucesso!');

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 300);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : defaultErrorMessage);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="register-name">Nome</Label>
        <InputGroup className="h-11">
          <InputGroupAddon>
            <User className="text-muted-foreground h-5 w-5" />
          </InputGroupAddon>
          <InputGroupInput id="register-name" name="name" placeholder="Seu nome" required />
        </InputGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <InputGroup className="h-11">
          <InputGroupAddon>
            <Mail className="text-muted-foreground h-5 w-5" />
          </InputGroupAddon>
          <InputGroupInput id="register-email" name="email" type="email" placeholder="seu@email.com" required />
        </InputGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">Senha</Label>
        <InputGroup className="h-11">
          <InputGroupAddon>
            <Lock className="text-muted-foreground h-5 w-5" />
          </InputGroupAddon>
          <InputGroupInput id="register-password" name="password" type="password" placeholder="••••••••" required />
        </InputGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmar Senha</Label>
        <InputGroup className="h-11">
          <InputGroupAddon>
            <Lock className="text-muted-foreground h-5 w-5" />
          </InputGroupAddon>
          <InputGroupInput
            id="confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
          />
        </InputGroup>
      </div>

      <Button
        type="submit"
        className="bg-primary hover:bg-primary/90 mt-4 h-11 w-full text-base font-medium"
        disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando conta...
          </>
        ) : (
          'Criar Conta'
        )}
      </Button>
    </form>
  );
}
