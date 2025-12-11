import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateFeatureFlagDto } from './create-feature-flag.dto';
import { IsEmpty } from 'class-validator';

export class UpdateFeatureFlagDto extends PartialType(
  OmitType(CreateFeatureFlagDto, ['environmentId'] as const),
) {
  @IsEmpty({
    message:
      'Não é permitido alterar o ambiente de uma feature flag existente.',
  })
  environmentId?: number;
}
