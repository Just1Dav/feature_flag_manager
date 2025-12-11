import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEnvDto {
  @IsString({ message: 'O nome do ambiente deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome do ambiente é obrigatório.' })
  name: string;

  @IsString({ message: 'A descrição do ambiente deve ser um texto.' })
  @IsOptional()
  description?: string | null;

  @IsInt({ message: 'O ID do projeto deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'O ID do projeto é obrigatório.' })
  projectId: number;
}
