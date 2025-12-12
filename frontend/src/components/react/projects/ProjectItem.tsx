import { useState } from 'react';
import { toast } from 'sonner';
import { ChevronRight, MoreVertical, Trash2, Loader2, FolderOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { type Project, $projects } from '@/stores/projectsStore';
import { EditProjectDialog } from '@/components/react/projects/EditProjectDialog';
import { ConfirmDialog } from '@/components/react/ConfirmDialog';

interface ProjectItemProps {
  project: Project;
}

export function ProjectItem({ project }: ProjectItemProps) {
  const handleDelete = async () => {
    const defaultErrorMessage = 'Ocorreu um erro ao excluir o projeto.';
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || defaultErrorMessage);
      }

      $projects.set($projects.get().filter((filteredProject) => filteredProject.id !== project.id));
      toast.success(`Projeto "${project.name}" excluído com sucesso!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : defaultErrorMessage);
    }
  };

  return (
    <Card className="group hover:border-l-primary/70 relative border-l-4 border-l-transparent transition-all hover:cursor-pointer hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-3">
        <a href={`/dashboard/projects/${project.id}`} className="flex min-w-0 flex-1 items-center gap-4">
          <div className="shrink-0 rounded-lg bg-orange-100/70 p-3">
            <FolderOpen className="h-6 w-6 text-orange-600" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-primary truncate text-lg font-semibold">{project.name}</CardTitle>
            <CardDescription className="truncate text-sm">{project.description}</CardDescription>
          </div>
        </a>

        {/* 2. Menu de Ações (Dropdown) */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 shadow-xl">
              {/* Editar */}
              <EditProjectDialog project={project} />

              {/* Excluir */}
              <ConfirmDialog
                title="Excluir projeto?"
                description={`Tem certeza que deseja excluir o projeto "${project.name}"? Esta ação não pode ser desfeita e todos os ambientes e feature flags serão perdidos.`}
                confirmText="Excluir"
                variant="destructive"
                onConfirm={handleDelete}>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive focus:bg-destructive/10 cursor-pointer">
                  <Trash2 className="text-destructive mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </ConfirmDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
    </Card>
  );
}
