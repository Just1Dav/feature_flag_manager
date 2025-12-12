import { Flag, LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function Header() {
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Você foi desconectado com sucesso.');
        window.location.href = '/auth';
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Erro ao tentar sair da conta.');
      }
    } catch (error) {
      toast.error('Não foi possível conectar ao servidor. Tente novamente.');
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
          className="text-destructive hover:bg-destructive/15 hover:cursor-pointer">
          <LogOut className="text-destructive mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </header>
  );
}
