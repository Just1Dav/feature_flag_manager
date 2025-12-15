import { IsNotEmpty } from 'class-validator';

export class FindByProjectDto {
  /**
   * O ID numérico do projeto ao qual o ambiente desta flag está vinculado.
   */
  @IsNotEmpty()
  projectId: number;
}
