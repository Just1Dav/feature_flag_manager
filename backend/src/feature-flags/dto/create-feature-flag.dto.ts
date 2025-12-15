import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFeatureFlagDto {
  /**
   * O nome da feature flag.
   * Geralmente utiliza-se kebab-case ou snake_case, mas não é obrigatório.
   * @example 'new-checkout-flow'
   */
  @IsString({ message: 'O nome da flag deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome da flag é obrigatório.' })
  name: string;

  /**
   * Uma descrição explicando o que essa flag controla.
   */
  @IsString({ message: 'A descrição da flag deve ser um texto.' })
  @IsOptional()
  description?: string | null;

  /**
   * Define se a flag inicia ativada (true) ou desativada (false).
   */
  @IsOptional()
  @IsBoolean({ message: 'O status deve ser verdadeiro ou falso.' })
  isActive?: boolean;

  /**
   * O ID numérico do ambiente ao qual esta flag pertence.
   */
  @IsInt({ message: 'O ID do ambiente deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'O ID do ambiente é obrigatório.' })
  environmentId: number;
}
