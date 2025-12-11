import { Exclude } from 'class-transformer';

/*
   Mantendo a entidade do ambiente para tipagem consistente e
   para caso de precisar algo no retorno dos ambientes futuramente
*/
export class EnviromentEntity {
  id: number;
  name: string;
  description: string | null;

  @Exclude()
  projectId: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  // Utilitário para facilitar a criação de instâncias da entidade
  constructor(partial: Partial<EnviromentEntity>) {
    Object.assign(this, partial);
  }
}
