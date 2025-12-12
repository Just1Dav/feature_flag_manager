import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateEnvDto } from './create-environment.dto';
import { IsEmpty } from 'class-validator';

export class UpdateEnvDto extends PartialType(OmitType(CreateEnvDto, ['projectId'] as const)) {
  @IsEmpty({
    message: 'Não é permitido alterar o projeto de um ambiente existente.',
  })
  projectId?: number;
}
