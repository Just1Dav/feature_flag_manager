import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class FindByProjectDto {
  @IsInt({ message: 'O ID do projeto é obrigatório.' })
  @IsNotEmpty()
  @Type(() => Number)
  projectId: number;
}
