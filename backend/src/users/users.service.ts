import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@/generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria um novo registro de usuário no banco de dados.
   *
   * @param data - O objeto contendo os dados do usuário (definido pelo schema do Prisma).
   * @returns Uma Promise com o objeto do usuário recém-criado.
   */
  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  /**
   * Busca um usuário pelo email no banco de dados.
   *
   * @param email - O email do usuário a ser buscado.
   * @returns Uma Promise com o objeto do usuário encontrado ou null se não existir.
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
