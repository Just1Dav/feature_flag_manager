import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { FolderOpen } from 'lucide-react';
import { $projects, setProjects } from '@/stores/projectsStore';
import { toast } from 'sonner';
import { ItemSkeleton } from '@/components/react/Skeletons';
import { ResourceItem } from '@/components/react/resources/ResourceItem';
import { EmptyState } from '@/components/react/EmptyState';

export function ProjectList() {
  const projects = useStore($projects);
  const [isLoading, setIsLoading] = useState(true);

  // Busca inicial dos dados ao montar o componente
  useEffect(() => {
    async function fetchProjects() {
      const defaultErrorMessage = 'Ocorreu um erro ao buscar seus projetos';
      try {
        const response = await fetch('/api/projects');

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || defaultErrorMessage);
        }

        const data = await response.json();

        setProjects(data);

        if (data.lenght > 0) toast.success('Projetos recuperados com sucesso!');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : defaultErrorMessage);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const containerClass = 'min-h-[50vh] w-full animate-in fade-in duration-500';

  if (isLoading) {
    return (
      <div className={containerClass}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ItemSkeleton />
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className={`${containerClass} flex items-center justify-center`}>
        <EmptyState
          Icon={FolderOpen}
          title="Nenhum projeto ainda"
          description="Crie seu primeiro projeto para começar a gerenciar suas feature flags"
        />
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ResourceItem
            resource="projects"
            key={project.id}
            resourceData={project}
            Icon={FolderOpen}
            destinyUrl={`/dashboard/projects/${project.id}`}
            deleteErrorMessage="Ocorreu um erro ao tentar excluir o projeto."
            deleteSuccessMessage={`Projeto "${project.name}" excluído com sucesso!`}
            deleteDialog={{
              title: 'Excluir projeto?',
              description: `Tem certeza que deseja excluir o projeto "${project.name}"? Esta ação não pode ser desfeita e todos os ambientes e feature flags serão perdidos.`,
              confirmText: 'Excluir',
              variant: 'destructive',
            }}
            updateResource={{
              dialogTitle: 'Editar projeto',
              dialogDescription: 'Faça alterações nos dados do projeto',
              successMessage: 'Projeto atualizado com sucesso',
              defaultErrorMessage: 'Ocorreu um erro ao editar o projeto.',
            }}
            data-astro-prefetch="hover"
          />
        ))}
      </div>
    </div>
  );
}
