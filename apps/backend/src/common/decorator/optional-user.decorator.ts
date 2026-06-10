import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { OptionalUserRequest } from '../interface/optional-user-request.interface'

export const OptionalUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<OptionalUserRequest>()
  return req.user?.id ?? null
})
