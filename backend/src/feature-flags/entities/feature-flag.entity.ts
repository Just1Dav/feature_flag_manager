import { EnvironmentEntity } from '@/environments/entities/environment.entity';
import { Exclude, Expose, Type } from 'class-transformer';

export class FeatureFlagEntity {
  id: number;
  name: string;
  description: string | null;

  isActive: boolean;

  @Exclude()
  environmentId: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Expose()
  @Type(() => EnvironmentEntity)
  environment?: EnvironmentEntity;

  constructor(partial: Partial<FeatureFlagEntity>) {
    Object.assign(this, partial);
  }
}
