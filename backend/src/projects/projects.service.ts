import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '@/database/prisma.service';
import { ProjectEntity } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectEntity> {
    const { name } = createProjectDto;

    await this.validateUniqueName(userId, name);

    const project = await this.prisma.project.create({
      data: {
        ...createProjectDto,
        userId,
      },
    });

    return new ProjectEntity(project);
  }

  async findAll(userId: number): Promise<ProjectEntity[]> {
    const projects = await this.prisma.project.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return projects.map((project) => new ProjectEntity(project));
  }

  async update(
    projectId: number,
    updateProjectDto: UpdateProjectDto,
    userId: number,
  ): Promise<ProjectEntity> {
    await this.validateProjectExistence(userId, projectId);

    if (updateProjectDto.name) {
      await this.validateUniqueName(userId, updateProjectDto.name, projectId);
    }

    const project = await this.prisma.project.update({
      where: { id: projectId },
      data: updateProjectDto,
    });

    return new ProjectEntity(project);
  }

  async remove(id: number, userId: number): Promise<ProjectEntity> {
    await this.validateProjectExistence(userId, id);
    const project = await this.prisma.project.delete({
      where: { id },
    });
    return new ProjectEntity(project);
  }

  private async validateUniqueName(
    userId: number,
    name: string,
    excludeProjectId?: number,
  ): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: {
        userId_name: {
          userId,
          name,
        },
      },
    });

    if (project) {
      if (!excludeProjectId || project.id !== excludeProjectId) {
        throw new ConflictException('Já possui um projeto com este nome.');
      }
    }
  }

  private async validateProjectExistence(userId: number, projectId: number) {
    const existingProject = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject || existingProject.userId !== userId) {
      throw new NotFoundException('Projeto não encontrado.');
    }
  }
}
