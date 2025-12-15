import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SigninDto {
  /**
   * O endereço de e-mail cadastrado do usuário.
   */
  @IsEmail({}, { message: 'O e-mail deve ser válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  /**
   * A senha de acesso à conta.
   * Deve conter no mínimo 6 caracteres.
   */
  @IsString({ message: 'A senha deve ser um texto.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  password: string;
}

export class SigninResponseDto {
  /**
   * O token JWT de acesso (Bearer Token).
   * Deve ser utilizado no cabeçalho Authorization das requisições protegidas.
   */
  @IsString()
  access_token: string;
}
