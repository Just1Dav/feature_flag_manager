import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserPayload {
  sub: number;
  iat?: number;
  exp?: number;
}

// Decorator para extrair o ID do usuário atual do request
export const CurrentUserId = createParamDecorator((data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<{ user?: UserPayload }>();

  const user = request.user;

  if (!user) return null;

  return data ? user[data] : user;
});
