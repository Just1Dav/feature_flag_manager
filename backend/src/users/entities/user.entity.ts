import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserEntity {
  id: number;
  name: string;
  email: string;

  // Exclui a senha ao serializar a entidade
  @ApiHideProperty()
  @Exclude()
  password: string;

  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
