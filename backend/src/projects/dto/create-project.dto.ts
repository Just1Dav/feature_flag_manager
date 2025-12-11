import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString({ message: 'O nome do projeto deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome do projeto é obrigatório.' })
  name: string;

  @IsString({ message: 'A descrição do projeto deve ser um texto.' })
  @IsOptional()
  description?: string | null;
}
