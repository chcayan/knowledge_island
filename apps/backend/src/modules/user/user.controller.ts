import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { UserService } from './user.service'
import type { RegisterDto } from '@knowledge_island/schemas'
import { RegisterSchema } from '@knowledge_island/schemas'
import { ZodValidationPipe } from '../../common/pipe/zod.pipe'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body(new ZodValidationPipe(RegisterSchema)) dto: RegisterDto) {
    return this.userService.register(dto)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }
}
