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
import { EnviromentEntity } from './entities/environment.entity';

@Controller('environments')
@UseGuards(AuthGuard)
export class EnvironmentsController {
  constructor(private readonly environmentsService: EnvironmentsService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEnvDto: CreateEnvDto): Promise<EnviromentEntity> {
    return this.environmentsService.create(createEnvDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(
    @Query('projectId', ParseIntPipe) projectId: number,
  ): Promise<EnviromentEntity[]> {
    return this.environmentsService.findAll(projectId);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id', ParseIntPipe) envId: number): Promise<EnviromentEntity> {
    return this.environmentsService.findOne(envId);
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  update(
    @Param('id', ParseIntPipe) envId: number,
    @Body() updateEnvDto: UpdateEnvDto,
  ): Promise<EnviromentEntity> {
    return this.environmentsService.update(envId, updateEnvDto);
  }

  @Delete(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  remove(@Param('id', ParseIntPipe) envId: number): Promise<EnviromentEntity> {
    return this.environmentsService.remove(envId);
  }
}
