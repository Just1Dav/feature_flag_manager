import { IsNotEmpty } from 'class-validator';

export class FindByProjectDto {
  @IsNotEmpty()
  projectId: number;
}
