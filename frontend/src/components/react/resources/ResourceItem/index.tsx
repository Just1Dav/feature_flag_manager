import { toast } from 'sonner';
import { MoreVertical, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ConfirmActionDialog } from '@/components/react/ConfirmActionDialog';
import { removeEnvironmentFromStore } from '@/stores/environmentsStore';
import { UpdateResourceDialog } from '@/components/react/resources/UpdateResourceDialog';
import type { IResourceItemProps } from '@/components/react/resources/ResourceItem/types';
import { removeProjectFromStore } from '@/stores/projectsStore';

export function ResourceItem({
  resource,
  resourceData,
  Icon,
  destinyUrl,
  deleteErrorMessage,
  deleteSuccessMessage,
  updateResource,
  deleteDialog,
}: IResourceItemProps) {
  const handleDelete = async () => {
    try {
      // Monta a URL
      const url = `/api/${resource}/${resourceData.id}`;

      // Realiza o DELETE
      const response = await fetch(url, { method: 'DELETE' });

      // Caso o retorno fracasse dispara um erro
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || deleteErrorMessage);
      }

      // Deleta o recurso da store de acordo com seu tipo
      if (resource === 'projects') removeProjectFromStore(resourceData.id);

      if (resource === 'environments') removeEnvironmentFromStore(resourceData.id);

      toast.success(deleteSuccessMessage);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : deleteErrorMessage);
    }
  };

  return (
    <Card className="group hover:border-l-primary/70 relative border-l-4 border-l-transparent transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-3">
        <a href={destinyUrl} className="z-30 flex min-w-0 flex-1 items-center gap-4 hover:cursor-pointer">
          <div className="shrink-0 rounded-lg bg-orange-100/70 p-3">
            <Icon className="h-6 w-6 text-orange-600" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-primary truncate text-lg font-semibold">{resourceData.name}</CardTitle>
            <CardDescription className="truncate text-sm">{resourceData.description}</CardDescription>
          </div>
        </a>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 shadow-xl">
              <UpdateResourceDialog
                resource={resource}
                resourceData={resourceData}
                dialogTitle={updateResource.dialogTitle}
                dialogDescription={updateResource.dialogDescription}
                defaultErrorMessage={updateResource.defaultErrorMessage}
                successMessage={updateResource.successMessage}
              />

              <ConfirmActionDialog
                title={deleteDialog.title}
                description={deleteDialog.description}
                confirmText={deleteDialog.confirmText}
                variant={deleteDialog.variant}
                onConfirm={handleDelete}>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive focus:bg-destructive/10 cursor-pointer">
                  <Trash2 className="text-destructive mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </ConfirmActionDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
    </Card>
  );
}
