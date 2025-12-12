import { Flag, Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

export function Header() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    const defaultErrorMessage = 'Ocorreu um erro ao tentar sair';

    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || defaultErrorMessage);
      }

      window.location.href = '/auth';
    } catch (error) {
      toast.error(error instanceof Error ? error.message : defaultErrorMessage);
      setIsLoading(false);
    }
  };

  return (
    <header className="bg-card/95 supports-backdrop-filter:bg-card/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <a href="/dashboard" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-lg">
            <Flag className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="text-xl font-semibold">FlagMaster</span>
        </a>

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-destructive hover:bg-destructive/15 hover:cursor-pointer"
          disabled={isLoading}>
          <LogOut className="text-destructive mr-2 h-4 w-4" />
          {isLoading ? 'Saindo...' : 'Sair'}
        </Button>
      </div>
    </header>
  );
}
