import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { FolderOpen } from 'lucide-react';
import { $projects, setProjects } from '@/stores/projectsStore';
import { EmptyState } from '@/components/react/EmptyState';
import { ProjectItem } from '@/components/react/projects/ProjectItem';
import { toast } from 'sonner';
import { ItemSkeleton } from '@/components/react/ItemSkeleton';

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
    return <ItemSkeleton containerClass={containerClass} />;
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
          <ProjectItem key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
