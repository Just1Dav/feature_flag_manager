import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { updateProjectInStore, type Project } from '@/stores/projectsStore';

interface EditProjectDialogProps {
  project: Project; // Requer o objeto Project para edição
}

export function EditProjectDialog({ project }: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Estado inicial preenchido com os dados do projeto
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || '');

  // Efeito para redefinir o estado se o modal abrir ou a prop mudar
  useEffect(() => {
    if (open) {
      setName(project.name);
      setDescription(project.description || '');
    }
  }, [open, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const defaultErrorMessage = 'Ocorreu um erro ao editar o projeto.';

    try {
      const url = `/api/projects/${project.id}`;

      const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }), // Envia apenas os campos alterados
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || defaultErrorMessage);
      }

      const updatedProject = await response.json();

      // 3. Atualiza a store global
      updateProjectInStore(updatedProject);

      toast.success('Projeto atualizado com sucesso!');
      setOpen(false); // Fecha o modal
    } catch (error) {
      toast.error(error instanceof Error ? error.message : defaultErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Gatilho: Botão "Editar" que será usado no Dropdown */}
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex w-full justify-start px-2 py-1.5 text-sm font-normal" // Estilos para se parecer com DropdownMenuItem
        >
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Editar Projeto</DialogTitle>
          <DialogDescription>Faça alterações nos dados do projeto.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do projeto"
              required
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="desc">Descrição</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do projeto (opcional)"
              className="h-24 resize-none"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary text-white">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
