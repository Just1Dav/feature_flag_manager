import type { ConfirmActionDialogProps } from '@/components/react/ConfirmActionDialog/types';
import type { IUpdateResourceDialogProps } from '@/components/react/resources/UpdateResourceDialog/types';
import type { Environment } from '@/stores/environmentsStore';
import type { LucideIcon } from 'lucide-react';

interface IResourceItemDataProps {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean;

  projectId?: number;
  environmentId?: number;

  environment?: Environment;
}

export interface IResourceItemProps {
  resource: 'projects' | 'environments' | 'feature-flags';
  resourceData: IResourceItemDataProps;
  Icon: LucideIcon;
  destinyUrl: string;
  deleteErrorMessage: string;
  deleteSuccessMessage: string;
  updateResource: Omit<IUpdateResourceDialogProps, 'resourceData' | 'resource'>;
  deleteDialog: Omit<ConfirmActionDialogProps, 'onConfirm' | 'children'>;
}
