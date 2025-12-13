import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

// Mockamos a biblioteca bcrypt para não realizar o processamento real de hash
jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  // Mocks dos serviços dependentes
  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  describe('signup', () => {
    const signupDto: SignupDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully register a new user', async () => {
      // 1. Simula que usuário NÃO existe
      mockUsersService.findByEmail.mockResolvedValue(null);
      // 2. Simula o hash da senha
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      // 3. Simula criação do usuário
      mockUsersService.create.mockResolvedValue({
        id: 1,
        ...signupDto,
        password: 'hashedPassword',
      });
      // 4. Simula geração do token
      mockJwtService.signAsync.mockResolvedValue('mockToken');

      const result = await authService.signup(signupDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(signupDto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(signupDto.password, 10);
      expect(usersService.create).toHaveBeenCalledWith({
        email: signupDto.email,
        name: signupDto.name,
        password: 'hashedPassword',
      });
      expect(result).toEqual({ access_token: 'mockToken' });
    });

    it('should throw ConflictException if email already exists', async () => {
      // Simula que usuário JÁ existe
      mockUsersService.findByEmail.mockResolvedValue({ id: 1, email: 'test@example.com' });

      await expect(authService.signup(signupDto)).rejects.toThrow(ConflictException);

      expect(usersService.create).not.toHaveBeenCalled();
    });
  });

  describe('signin', () => {
    const signinDto: SigninDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      name: 'Test User',
    };

    it('should successfully login a user', async () => {
      // 1. Encontra usuário
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      // 2. Senha bate
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      // 3. Gera token
      mockJwtService.signAsync.mockResolvedValue('mockToken');

      const result = await authService.signin(signinDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(signinDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(signinDto.password, mockUser.password);
      expect(result).toEqual({ access_token: 'mockToken' });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(authService.signin(signinDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      // Simula senha incorreta
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.signin(signinDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
