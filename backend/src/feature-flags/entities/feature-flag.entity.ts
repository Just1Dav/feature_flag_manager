import { Exclude } from 'class-transformer';

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

  constructor(partial: Partial<FeatureFlagEntity>) {
    Object.assign(this, partial);
  }
}
