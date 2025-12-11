import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';

// Mantendo o DTO criado para caso de adição futura de campos no update
export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
