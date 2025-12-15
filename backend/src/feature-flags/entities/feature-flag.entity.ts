import { EnvironmentEntity } from '@/environments/entities/environment.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

export class FeatureFlagEntity {
  id: number;
  name: string;
  description: string | null;

  isActive: boolean;

  @ApiHideProperty()
  @Exclude()
  environmentId: number;

  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;

  @Expose()
  @Type(() => EnvironmentEntity)
  environment?: EnvironmentEntity;

  constructor(partial: Partial<FeatureFlagEntity>) {
    Object.assign(this, partial);
  }
}
