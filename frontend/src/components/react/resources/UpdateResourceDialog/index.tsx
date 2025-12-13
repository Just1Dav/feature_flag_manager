import React, { useState } from 'react';
import { Loader2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateEnvironmentInStore } from '@/stores/environmentsStore';
import { updateFlagInStore } from '@/stores/flagsStore';
import { Switch } from '@/components/ui/switch';
import type {
  IUpdateResourceProps,
  IUpdateResourceDialogProps,
} from '@/components/react/resources/UpdateResourceDialog/types';
import { updateProjectInStore } from '@/stores/projectsStore';

export function UpdateResourceDialog({
  resourceData,
  resource,
  dialogTitle,
  dialogDescription,
  successMessage,
  defaultErrorMessage,
  confirmButtonText = 'Salvar',
}: IUpdateResourceDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(resourceData.name || '');
  const [description, setDescription] = useState(resourceData.description || '');

  // Para controlar o update das feature flags
  const [isActive, setIsActive] = useState(resourceData.isActive || false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Monta a url de acordo com recurso e o dado
      const url = `/api/${resource}/${resourceData.id}`;

      let body: Omit<IUpdateResourceProps, 'id'> = { name, description };

      if (resource === 'feature-flags') body = { ...body, isActive: isActive };

      // Realiza o PATCH com os dados a serem atualizados
      const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      // Caso o retorno fracasse dispara um erro
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || defaultErrorMessage);
      }

      const updatedResource = await response.json();

      // Atualiza a store global com base no resource
      if (resource === 'projects') {
        updateProjectInStore(updatedResource);
      }

      if (resource === 'environments') {
        updateEnvironmentInStore(updatedResource);
      }

      if (resource === 'feature-flags') {
        updateFlagInStore(updatedResource);
      }

      toast.success(successMessage);
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : defaultErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex w-full justify-start px-2 py-1.5 text-sm font-normal">
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="env-name">Nome *</Label>
            <Input id="env-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="env-desc">Descrição</Label>
            <Textarea
              id="env-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição"
              className="h-24 resize-none"
            />
          </div>

          {resource === 'feature-flags' && (
            <div className="bg-muted/20 flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Status</Label>
                <p className="text-muted-foreground text-sm">{isActive ? 'Flag ativada' : 'Flag desativada'}</p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary text-white">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : confirmButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
