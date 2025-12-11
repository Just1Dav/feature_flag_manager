import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { DatabaseModule } from './database/database.module.js';
import { ProjectsModule } from './projects/projects.module';
import { EnvironmentsModule } from './environments/environments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Disponível em todo o projeto (não precisa importar em cada módulo)
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    EnvironmentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
