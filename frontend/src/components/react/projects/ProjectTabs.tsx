import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnvironmentList } from '@/components/react/environments/EnvironmentList';
import { CreateResourceDialog } from '@/components/react/resources/CreateResourceDialog';
import { FlagList } from '@/components/react/flags/FlagList';

interface ProjectTabsProps {
  projectId: number;
}

export function ProjectTabs({ projectId }: ProjectTabsProps) {
  return (
    <Tabs defaultValue="environments" className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="environments">Ambientes</TabsTrigger>
          <TabsTrigger value="flags">Feature Flags</TabsTrigger>
        </TabsList>
      </div>

      {/* ABA DE AMBIENTES */}
      <TabsContent value="environments" className="mt-0 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Ambientes</h2>
          <CreateResourceDialog
            resource="environments"
            resourceData={{ projectId }}
            defaultErrorMessage="Ocorreu um erro ao tentar criar o ambiente!"
            successMessage="Ambiente criado com sucesso!"
            createButtonText="Novo Ambiente"
            dialogTitle="Novo ambiente"
            dialogDescription="Adicione um ambiente (ex: Produção, Staging) para este projeto."
            confirmButtonText="Criar Ambiente"
          />
        </div>

        <EnvironmentList projectId={projectId} />
      </TabsContent>

      {/* ABA DE FEATURE FLAGS */}
      <TabsContent value="flags">
        <FlagList projectId={projectId} showFlagByProjects />
      </TabsContent>
    </Tabs>
  );
}
