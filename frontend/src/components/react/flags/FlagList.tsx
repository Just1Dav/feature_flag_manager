import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $flags, setFlags } from '@/stores/flagsStore';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flag, Search } from 'lucide-react';
import { FlagItem } from './FlagItem';
import { toast } from 'sonner';
import { CreateResourceDialog } from '@/components/react/resources/CreateResourceDialog';
import { FeatureFlagItemSkeleton } from '@/components/react/Skeletons';
import { EmptyState } from '@/components/react/EmptyState';

interface Props {
  projectId: number;
  environmentId?: number;
  showFlagByProjects?: boolean;
}

export function FlagList({ projectId, environmentId, showFlagByProjects = false }: Props) {
  const flags = useStore($flags);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function fetchFlags() {
      const defaultErrorMessage = 'Ocorreu um erro ao buscar suas feature flags';
      try {
        const flagsByEnvironmentsUrl = `/api/feature-flags/?environmentId=${environmentId}`;

        const flagsByProjectsUrl = `/api/feature-flags/project/${projectId}`;

        const url = showFlagByProjects ? flagsByProjectsUrl : flagsByEnvironmentsUrl;

        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || defaultErrorMessage);
        }

        const data = await response.json();

        setFlags(data);

        if (data.length > 0) toast.success('Feature flags recuperadas com sucesso!');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : defaultErrorMessage);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFlags();
  }, [projectId, environmentId]);

  // Filtragem local
  const filteredFlags = flags.filter((flag) => {
    const matchesSearch =
      flag.name.toLowerCase().includes(search.toLowerCase()) || flag.name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' ? true : statusFilter === 'active' ? flag.isActive : !flag.isActive;

    return matchesSearch && matchesStatus;
  });

  const containerClass = 'min-h-[50vh] w-full animate-in fade-in duration-500';

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex w-full flex-1 gap-2 sm:w-auto">
          <div className="relative w-full sm:w-75">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              placeholder="Buscar flags..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32.5">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="active">Ativas</SelectItem>
              <SelectItem value="inactive">Inativas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!showFlagByProjects && (
          <CreateResourceDialog
            resource="feature-flags"
            resourceData={{ environmentId }}
            dialogTitle="Nova feature flag"
            createButtonText="Nova Flag"
            defaultErrorMessage="Ocorreu um erro ao tentar criar a feature flag"
            confirmButtonText="Criar Flag"
            successMessage="Feature flag criada com sucesso!"
          />
        )}
      </div>

      {filteredFlags.length > 0 && isLoading && <FeatureFlagItemSkeleton />}

      {/* Lista ou Empty State */}
      {filteredFlags.length === 0 && (
        <div className={`${containerClass} flex items-center justify-center`}>
          <EmptyState
            Icon={Flag}
            title={search ? 'Nenhuma flag encontrada' : 'Nenhuma feature flag'}
            description={
              search
                ? 'Tente buscar por outro termo.'
                : 'Crie sua primeira flag para começar a controlar features neste ambiente.'
            }
          />
        </div>
      )}

      {filteredFlags.length > 0 && !isLoading && (
        <div className={containerClass}>
          <div className="space-y-3">
            {filteredFlags.map((flag) => (
              <FlagItem key={flag.id} flag={flag} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
