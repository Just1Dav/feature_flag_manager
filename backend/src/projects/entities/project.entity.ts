/*
   Mantendo a entidade do projeto para tipagem consistente e
   para caso de precisar algo no retorno dos projetos futuramente
*/
export class ProjectEntity {
  id: number;
  name: string;
  description: string | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ProjectEntity>) {
    Object.assign(this, partial);
  }
}
