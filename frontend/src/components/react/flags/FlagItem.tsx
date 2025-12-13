import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Flag, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { updateFlagInStore, removeFlagFromStore, type FeatureFlag } from '@/stores/flagsStore';
import { ConfirmActionDialog } from '@/components/react/ConfirmActionDialog';
import { UpdateResourceDialog } from '@/components/react/resources/UpdateResourceDialog';
import { Badge } from '@/components/ui/badge';

interface Props {
  flag: FeatureFlag;
}

export function FlagItem({ flag }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (isToggled: boolean) => {
    setIsLoading(true);
    const defaultUpdateStatusErroMessage = 'Erro ao atualizar status';
    try {
      // Monta a url
      const url = `/api/feature-flags/${flag.id}`;

      // Faz o PATCH atualizando apenas o status
      const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: isToggled }),
      });

      // Caso o retorno fracasse dispara um erro
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || defaultUpdateStatusErroMessage);
      }

      const updatedFlag = await response.json();

      // Atualiza a store global com base no status
      updateFlagInStore({ ...flag, isActive: updatedFlag.isActive });

      toast.success(`A flag ${flag.name} foi ${updatedFlag.isActive ? 'ativada' : 'desativada'}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : defaultUpdateStatusErroMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const defaultDeleteErroMessage = 'Erro ao tentar excluir a flag';
    try {
      // Monta a url
      const url = `/api/feature-flags/${flag.id}`;

      // Faz o DELETE para excluir a flag
      const response = await fetch(url, { method: 'DELETE' });

      // Caso o retorno fracasse dispara um erro
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || defaultDeleteErroMessage);
      }

      // Atualiza a store global apagando a flag excluída
      removeFlagFromStore(flag.id);

      toast.success('Flag excluída com sucesso!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : defaultDeleteErroMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-row items-center justify-between p-7">
      <div className="flex min-w-0 flex-1 items-center gap-5">
        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100/70 md:flex">
          <Flag className="text-primary h-5 w-5" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="flex flex-col gap-2 md:flex-row">
            <span className="text-foreground space-x-2 truncate leading-none font-medium">{flag.name}</span>
            {flag.environment && <Badge className="hidden md:block">{flag.environment.name}</Badge>}
          </div>

          {flag.description && (
            <p className="text-muted-foreground mt-1 line-clamp-1 truncate text-sm">{flag.description}</p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-6">
        <Switch checked={flag.isActive} onCheckedChange={handleToggle} disabled={isLoading} className="scale-120" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 shadow-xl">
            <UpdateResourceDialog
              resource="feature-flags"
              resourceData={flag}
              dialogTitle="Editar feature flag"
              defaultErrorMessage="Ocorreu um erro ao atualizar a feature flag!"
              successMessage="Feature flag atualizada com sucesso!"
            />

            <ConfirmActionDialog title={`Excluir flag "${flag.name}"?`} onConfirm={handleDelete} variant="destructive">
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-destructive focus:bg-destructive/10 cursor-pointer">
                <Trash2 className="text-destructive mr-2 h-4 w-4" /> Excluir
              </DropdownMenuItem>
            </ConfirmActionDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
