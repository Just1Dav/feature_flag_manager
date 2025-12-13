import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/database/prisma.service';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const userPayload = {
    name: 'E2E User',
    email: 'e2e_test@example.com',
    password: 'password123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // pipes globais do utilizada no main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // instância do Prisma para limpar o banco
    prisma = app.get(PrismaService);

    await app.init();
  });

  // Limpa o banco antes de começar
  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: { email: userPayload.email },
    });
  });

  afterAll(async () => {
    // Limpeza final e fechamento
    await prisma.user.deleteMany({
      where: { email: userPayload.email },
    });

    await app.close();

    // Desçigamento do prisma
    await prisma.$disconnect();
  });

  describe('/auth/signup (POST)', () => {
    it('should register a new user and return access_token', async () => {
      const response = await request(app.getHttpServer()).post('/auth/signup').send(userPayload).expect(201);

      expect(response.body).toHaveProperty('access_token');
      const userInDb = await prisma.user.findUnique({ where: { email: userPayload.email } });
      expect(userInDb).toBeDefined();
    });

    it('should fail if email is already registered', async () => {
      await request(app.getHttpServer()).post('/auth/signup').send(userPayload).expect(409);
    });

    it('should fail with invalid data (short password)', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ ...userPayload, password: '123' })
        .expect(400);
    });
  });

  describe('/auth/signin (POST)', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: userPayload.email,
          password: userPayload.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
    });

    it('should fail with wrong password', async () => {
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: userPayload.email,
          password: 'wrong-password',
        })
        .expect(401);
    });

    it('should fail if user does not exist', async () => {
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(404);
    });
  });
});
