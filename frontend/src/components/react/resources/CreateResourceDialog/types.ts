interface ICreateResourceData {
  projectId?: number;
  environmentId?: number;
}

export interface ICreateResourceProps {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean;
  projectId?: number;
  environmentId?: number;
}

export interface ICreateResourceDialogProps {
  resourceData?: ICreateResourceData;
  resource: 'projects' | 'environments' | 'feature-flags';
  createButtonText: string;
  dialogTitle: string;
  dialogDescription?: string;
  successMessage: string;
  defaultErrorMessage: string;
  confirmButtonText?: string;
}
