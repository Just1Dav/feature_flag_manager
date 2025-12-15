import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

/*
   Mantendo a entidade do projeto para tipagem consistente e
   para caso de precisar algo no retorno dos projetos futuramente
*/
export class ProjectEntity {
  id: number;
  name: string;
  description: string | null;

  @ApiHideProperty()
  @Exclude()
  userId: number;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;

  // Utilitário para facilitar a criação de instâncias da entidade
  constructor(partial: Partial<ProjectEntity>) {
    Object.assign(this, partial);
  }
}
