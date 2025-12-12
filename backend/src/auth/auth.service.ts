import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SigninDto, SigninResponseDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<SigninResponseDto> {
    const { email, password, name } = signupDto;

    const userExists = await this.usersService.findByEmail(email);

    if (userExists) {
      throw new ConflictException('O e-mail já está em uso.');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const newUser = await this.usersService.create({
      email,
      name,
      password: hashedPassword,
    });

    const payload = { sub: newUser.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signin(signinDto: SigninDto): Promise<SigninResponseDto> {
    const user = await this.usersService.findByEmail(signinDto.email);

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const passwordMatch = await bcrypt.compare(signinDto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = { sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
