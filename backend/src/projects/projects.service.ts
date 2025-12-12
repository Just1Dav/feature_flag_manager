import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '@/database/prisma.service';
import { ProjectEntity } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createProjectDto: CreateProjectDto): Promise<ProjectEntity> {
    const { name } = createProjectDto;

    await this.validateUniqueProjectName(userId, name);

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
        userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return projects.map((project) => new ProjectEntity(project));
  }

  async findOne(projectId: number, userId: number): Promise<ProjectEntity> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      throw new NotFoundException('Projeto não encontrado.');
    }

    return new ProjectEntity(project);
  }

  async update(projectId: number, updateProjectDto: UpdateProjectDto, userId: number): Promise<ProjectEntity> {
    const currentProject = await this.findOne(projectId, userId);

    if (updateProjectDto.name && updateProjectDto.name !== currentProject.name) {
      await this.validateUniqueProjectName(userId, updateProjectDto.name);
    }

    const project = await this.prisma.project.update({
      where: { id: projectId },
      data: updateProjectDto,
    });

    return new ProjectEntity(project);
  }

  async remove(projectId: number, userId: number): Promise<ProjectEntity> {
    await this.findOne(projectId, userId);

    const project = await this.prisma.project.delete({
      where: { id: projectId },
    });

    return new ProjectEntity(project);
  }

  private async validateUniqueProjectName(userId: number, name: string): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: {
        userId_name: {
          userId,
          name,
        },
      },
    });

    if (project) {
      throw new ConflictException('Já existe um projeto com este nome.');
    }
  }
}
