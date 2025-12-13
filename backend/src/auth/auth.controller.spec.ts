import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signup: jest.fn(),
    signin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signup and return the token', async () => {
      const signupDto: SignupDto = {
        name: 'Test',
        email: 'test@test.com',
        password: '123',
      };

      const expectedResult = { access_token: 'token123' };
      mockAuthService.signup.mockResolvedValue(expectedResult);

      const result = await authController.signup(signupDto);

      expect(authService.signup).toHaveBeenCalledWith(signupDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('signin', () => {
    it('should call authService.signin and return the token', async () => {
      const signinDto: SigninDto = {
        email: 'test@test.com',
        password: '123',
      };

      const expectedResult = { access_token: 'token123' };
      mockAuthService.signin.mockResolvedValue(expectedResult);

      const result = await authController.signin(signinDto);

      expect(authService.signin).toHaveBeenCalledWith(signinDto);
      expect(result).toEqual(expectedResult);
    });
  });
});
