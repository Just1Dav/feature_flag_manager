export interface IUpdateResourceProps {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface IUpdateResourceDialogProps {
  resourceData: IUpdateResourceProps;
  resource: 'projects' | 'environments' | 'feature-flags';
  dialogTitle: string;
  dialogDescription?: string;
  successMessage: string;
  defaultErrorMessage: string;
  confirmButtonText?: string;
}
