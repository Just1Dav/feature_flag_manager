import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto, SigninResponseDto } from './dto/signin.dto';
import { UserEntity } from '@/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<UserEntity> {
    return this.authService.signup(signupDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() signinDto: SigninDto): Promise<SigninResponseDto> {
    return this.authService.signin(signinDto);
  }
}
