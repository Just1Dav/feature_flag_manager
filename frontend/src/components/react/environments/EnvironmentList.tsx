import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $environments, setEnvironments } from '@/stores/environmentsStore';
import { Container } from 'lucide-react';
import { toast } from 'sonner';
import { ItemSkeleton } from '@/components/react/Skeletons';
import { ResourceItem } from '@/components/react/resources/ResourceItem';
import { EmptyState } from '@/components/react/EmptyState';

interface Props {
  projectId: number;
}

export function EnvironmentList({ projectId }: Props) {
  const environments = useStore($environments);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEnvs() {
      const defaultErrorMessage = 'Ocorreu um erro ao buscar seus ambientes';
      try {
        const url = `/api/environments/?projectId=${projectId}`;
        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || defaultErrorMessage);
        }

        const data = await response.json();

        setEnvironments(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : defaultErrorMessage);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEnvs();
  }, [projectId]);

  const containerClass = 'min-h-[50vh] w-full animate-in fade-in duration-500';

  if (isLoading) {
    return (
      <div className={containerClass}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ItemSkeleton />;
        </div>
      </div>
    );
  }

  if (environments.length === 0) {
    return (
      <div className={`${containerClass} flex items-center justify-center`}>
        <EmptyState
          Icon={Container}
          title="Nenhum ambiente"
          description="Crie ambientes para organizar suas feature flags por contexto (ex: Produção, Staging)."
        />
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {environments.map((env) => (
          <ResourceItem
            resource="environments"
            key={env.id}
            resourceData={env}
            Icon={Container}
            destinyUrl={`/dashboard/projects/${projectId}/environments/${env.id}`}
            deleteErrorMessage="Ocorreu um erro ao excluir o ambiente."
            deleteSuccessMessage={`O ambiente "${env.name}" excluído com sucesso!`}
            deleteDialog={{
              title: 'Excluir Ambiente?',
              description: `Tem certeza que deseja excluir o ambiente "${env.name}"? Esta ação não pode ser desfeita e todos as feature flags serão perdidas.`,
              confirmText: 'Excluir',
              variant: 'destructive',
            }}
            updateResource={{
              dialogTitle: 'Editar ambiente',
              dialogDescription: 'Faça alterações nos dados do ambiente.',
              defaultErrorMessage: 'Ocorreu um erro ao editar o ambiente.',
              successMessage: 'Ambiente atualizado com sucesso!',
            }}
            data-astro-prefetch="hover"
          />
        ))}
      </div>
    </div>
  );
}
