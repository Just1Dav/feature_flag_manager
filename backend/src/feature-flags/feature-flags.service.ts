import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFeatureFlagDto } from './dto/create-feature-flag.dto';
import { UpdateFeatureFlagDto } from './dto/update-feature-flag.dto';
import { FeatureFlagEntity } from './entities/feature-flag.entity';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class FeatureFlagsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createFeatureFlagDto: CreateFeatureFlagDto,
  ): Promise<FeatureFlagEntity> {
    const { environmentId, name } = createFeatureFlagDto;

    await this.validateUniqueFeatureFlagName(environmentId, name);

    const flag = await this.prisma.featureFlag.create({
      data: createFeatureFlagDto,
    });

    return new FeatureFlagEntity(flag);
  }

  async findAll(environmentId: number): Promise<FeatureFlagEntity[]> {
    const flags = await this.prisma.featureFlag.findMany({
      where: {
        environmentId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return flags.map((flag) => new FeatureFlagEntity(flag));
  }

  async findOne(featureFlagId: number): Promise<FeatureFlagEntity> {
    const flag = await this.prisma.featureFlag.findUnique({
      where: { id: featureFlagId },
    });

    if (!flag) {
      throw new NotFoundException('Ambiente não encontrado.');
    }

    return new FeatureFlagEntity(flag);
  }

  async update(
    featureFlagId: number,
    updateFeatureFlagDto: UpdateFeatureFlagDto,
  ): Promise<FeatureFlagEntity> {
    const currentFlag = await this.findOne(featureFlagId);

    if (
      updateFeatureFlagDto.name &&
      updateFeatureFlagDto.name !== currentFlag.name
    ) {
      await this.validateUniqueFeatureFlagName(
        currentFlag.environmentId,
        updateFeatureFlagDto.name,
      );
    }

    const flag = await this.prisma.featureFlag.update({
      where: { id: featureFlagId },
      data: updateFeatureFlagDto,
    });

    return new FeatureFlagEntity(flag);
  }

  async remove(featureFlagId: number): Promise<FeatureFlagEntity> {
    await this.findOne(featureFlagId);

    const flag = await this.prisma.featureFlag.delete({
      where: { id: featureFlagId },
    });

    return new FeatureFlagEntity(flag);
  }

  async findFeatureFlagsByProject(
    projectId: number,
  ): Promise<FeatureFlagEntity[]> {
    const flags = await this.prisma.featureFlag.findMany({
      where: {
        environment: {
          projectId: projectId,
        },
      },
      include: {
        environment: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return flags.map((flag) => new FeatureFlagEntity(flag));
  }

  private async validateUniqueFeatureFlagName(
    environmentId: number,
    name: string,
  ): Promise<void> {
    const existingEnv = await this.prisma.featureFlag.findUnique({
      where: {
        environmentId_name: {
          environmentId,
          name,
        },
      },
    });

    if (existingEnv) {
      throw new ConflictException(
        'Já existe uma feature flag com este nome neste ambiente.',
      );
    }
  }
}
