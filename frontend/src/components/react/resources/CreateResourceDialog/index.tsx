import React, { useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { addFlagToStore } from '@/stores/flagsStore';
import type {
  ICreateResourceDialogProps,
  ICreateResourceProps,
} from '@/components/react/resources/CreateResourceDialog/types';
import { addProjectToStore } from '@/stores/projectsStore';
import { addEnvironmentToStore } from '@/stores/environmentsStore';

export function CreateResourceDialog({
  resource,
  resourceData,
  createButtonText,
  dialogTitle,
  dialogDescription,
  defaultErrorMessage,
  successMessage,
  confirmButtonText = 'Salvar',
}: ICreateResourceDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados do formulário
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [isActive, setIsActive] = useState(false);

  // Função para resetar o formulário
  const resetForm = () => {
    setName('');
    setDescription('');
    setIsActive(false);
  };

  const handleCancel = () => {
    setOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Monta a url de acordo com recurso e o dado
      const url = `/api/${resource}`;

      let body: Omit<ICreateResourceProps, 'id'> = {
        name,
        description,
      };

      if (resource === 'feature-flags')
        body = { ...body, isActive: isActive, environmentId: resourceData?.environmentId };

      if (resource === 'environments') {
        body = { ...body, projectId: resourceData?.projectId };
      }

      // Realiza o POST com os dados a serem criados
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      // Caso o retorno fracasse dispara um erro
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || defaultErrorMessage);
      }

      const newResource = await response.json();

      // Cria a store global com base no resource
      if (resource === 'projects') {
        addProjectToStore(newResource);
      }

      if (resource === 'environments') {
        addEnvironmentToStore(newResource);
      }

      if (resource === 'feature-flags') {
        addFlagToStore(newResource);
      }

      toast.success(successMessage);
      handleCancel();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : defaultErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={'lg'} className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="mr-2 h-4 w-4" />
          {createButtonText}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="flag-name">Nome *</Label>
            <Input id="flag-name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nome" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="flag-description">Descrição</Label>
            <Textarea
              id="flag-description"
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
            <Button type="button" variant="outline" onClick={handleCancel}>
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
