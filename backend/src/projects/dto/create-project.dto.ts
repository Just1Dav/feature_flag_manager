import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  /**
   * O nome de identificação do projeto.
   */
  @IsString({ message: 'O nome do projeto deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome do projeto é obrigatório.' })
  name: string;

  /**
   * Uma breve descrição sobre o objetivo do projeto.
   */
  @IsString({ message: 'A descrição do projeto deve ser um texto.' })
  @IsOptional()
  description?: string | null;
}
