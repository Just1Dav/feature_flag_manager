import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEnvDto {
  /**
   * O nome de identificação do ambiente.
   */
  @IsString({ message: 'O nome do ambiente deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome do ambiente é obrigatório.' })
  name: string;

  /**
   * Uma descrição opcional sobre a finalidade deste ambiente.
   */
  @IsString({ message: 'A descrição do ambiente deve ser um texto.' })
  @IsOptional()
  description?: string | null;

  /**
   * O ID numérico do projeto ao qual este ambiente será vinculado.
   */
  @IsInt({ message: 'O ID do projeto deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'O ID do projeto é obrigatório.' })
  projectId: number;
}
