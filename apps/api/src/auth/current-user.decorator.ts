import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface RequestWithUser {
  user: {
    userId: string;
    email: string;
  };
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as RequestWithUser;
    return request.user;
  },
); 