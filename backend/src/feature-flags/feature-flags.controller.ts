import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FeatureFlagsService } from './feature-flags.service';
import { CreateFeatureFlagDto } from './dto/create-feature-flag.dto';
import { UpdateFeatureFlagDto } from './dto/update-feature-flag.dto';
import { AuthGuard } from '@/auth/auth.guard';
import { FeatureFlagEntity } from './entities/feature-flag.entity';
import { FindByProjectDto } from './dto/find-by-project.dto';

@Controller('feature-flags')
@UseGuards(AuthGuard)
export class FeatureFlagsController {
  constructor(private readonly featureFlagsService: FeatureFlagsService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createFeatureFlagDto: CreateFeatureFlagDto,
  ): Promise<FeatureFlagEntity> {
    return await this.featureFlagsService.create(createFeatureFlagDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @Query('environmentId', ParseIntPipe) environmentId: number,
  ): Promise<FeatureFlagEntity[]> {
    return await this.featureFlagsService.findAll(environmentId);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Param('id', ParseIntPipe) featureFlagId: number,
  ): Promise<FeatureFlagEntity> {
    return await this.featureFlagsService.findOne(featureFlagId);
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) featureFlagId: number,
    @Body() updateFeatureFlagDto: UpdateFeatureFlagDto,
  ): Promise<FeatureFlagEntity> {
    return await this.featureFlagsService.update(
      featureFlagId,
      updateFeatureFlagDto,
    );
  }

  @Delete(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async remove(
    @Param('id', ParseIntPipe) featureFlagId: number,
  ): Promise<FeatureFlagEntity> {
    return await this.featureFlagsService.remove(featureFlagId);
  }

  @Get()
  async findFeatureFlagsByProject(
    @Query() query: FindByProjectDto,
  ): Promise<FeatureFlagEntity[]> {
    return this.featureFlagsService.findFeatureFlagsByProject(query.projectId);
  }
}
