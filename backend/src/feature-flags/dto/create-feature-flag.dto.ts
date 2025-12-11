import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFeatureFlagDto {
  @IsString({ message: 'O nome da flag deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome da flag é obrigatório.' })
  name: string;

  @IsString({ message: 'A descrição da flag deve ser um texto.' })
  @IsOptional()
  description?: string | null;

  @IsOptional()
  @IsBoolean({ message: 'O status deve ser verdadeiro ou falso.' })
  isActive?: boolean;

  @IsInt({ message: 'O ID do ambiente deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'O ID do ambiente é obrigatório.' })
  environmentId: number;
}
