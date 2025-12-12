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
  HttpCode,
  HttpStatus,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { EnvironmentsService } from './environments.service';
import { CreateEnvDto } from './dto/create-environment.dto';
import { UpdateEnvDto } from './dto/update-environment.dto';
import { AuthGuard } from '@/auth/auth.guard';
import { EnvironmentEntity } from './entities/environment.entity';

@Controller('environments')
@UseGuards(AuthGuard)
export class EnvironmentsController {
  constructor(private readonly environmentsService: EnvironmentsService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEnvDto: CreateEnvDto): Promise<EnvironmentEntity> {
    return this.environmentsService.create(createEnvDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query('projectId', ParseIntPipe) projectId: number): Promise<EnvironmentEntity[]> {
    return this.environmentsService.findAll(projectId);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) environmentId: number): Promise<EnvironmentEntity> {
    return this.environmentsService.findOne(environmentId);
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) environmentId: number,
    @Body() updateEnvDto: UpdateEnvDto,
  ): Promise<EnvironmentEntity> {
    return this.environmentsService.update(environmentId, updateEnvDto);
  }

  @Delete(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async remove(@Param('id', ParseIntPipe) environmentId: number): Promise<EnvironmentEntity> {
    return this.environmentsService.remove(environmentId);
  }
}
