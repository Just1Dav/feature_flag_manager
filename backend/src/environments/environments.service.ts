import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEnvDto } from './dto/create-environment.dto';
import { UpdateEnvDto } from './dto/update-environment.dto';
import { PrismaService } from '@/database/prisma.service';
import { EnvironmentEntity } from './entities/environment.entity';

@Injectable()
export class EnvironmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createEnvDto: CreateEnvDto): Promise<EnvironmentEntity> {
    const { projectId, name } = createEnvDto;

    await this.validateUniqueEnvName(projectId, name);

    const env = await this.prisma.environment.create({
      data: createEnvDto,
    });

    return new EnvironmentEntity(env);
  }

  async findAll(projectId: number): Promise<EnvironmentEntity[]> {
    const envs = await this.prisma.environment.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return envs.map((env) => new EnvironmentEntity(env));
  }

  async findOne(environmentId: number): Promise<EnvironmentEntity> {
    const env = await this.prisma.environment.findUnique({
      where: { id: environmentId },
    });

    if (!env) {
      throw new NotFoundException('Ambiente não encontrado.');
    }

    return new EnvironmentEntity(env);
  }

  async update(
    environmentId: number,
    updateEnvDto: UpdateEnvDto,
  ): Promise<EnvironmentEntity> {
    const currentEnv = await this.findOne(environmentId);

    if (updateEnvDto.name && updateEnvDto.name !== currentEnv.name) {
      await this.validateUniqueEnvName(currentEnv.projectId, updateEnvDto.name);
    }

    const env = await this.prisma.environment.update({
      where: { id: environmentId },
      data: updateEnvDto,
    });

    return new EnvironmentEntity(env);
  }

  async remove(environmentId: number) {
    await this.findOne(environmentId);

    const env = await this.prisma.environment.delete({
      where: { id: environmentId },
    });

    return new EnvironmentEntity(env);
  }

  private async validateUniqueEnvName(
    projectId: number,
    name: string,
  ): Promise<void> {
    const existingEnv = await this.prisma.environment.findUnique({
      where: {
        projectId_name: {
          projectId,
          name,
        },
      },
    });

    if (existingEnv) {
      throw new ConflictException(
        'Já existe um ambiente com este nome neste projeto.',
      );
    }
  }
}
