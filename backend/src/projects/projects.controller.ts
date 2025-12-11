import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectEntity } from './entities/project.entity';
import { AuthGuard } from '@/auth/auth.guard';
import { CurrentUserId } from '@/auth/decorators/current-user.decorator';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUserId('sub') userId: number,
  ): Promise<ProjectEntity> {
    return this.projectsService.create(userId, createProjectDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@CurrentUserId('sub') userId: number): Promise<ProjectEntity[]> {
    return this.projectsService.findAll(userId);
  }

  @Patch(':id')
  update(
    @Param('id') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUserId('sub') userId: number,
  ): Promise<ProjectEntity> {
    return this.projectsService.update(+projectId, updateProjectDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') projectId: string, @CurrentUserId('sub') userId: number) {
    return this.projectsService.remove(+projectId, userId);
  }
}
