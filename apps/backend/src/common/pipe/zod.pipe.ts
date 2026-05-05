import { BadRequestException, PipeTransform } from '@nestjs/common'
import { z } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: z.ZodType) {}

  transform(value: any) {
    const result = this.schema.safeParse(value)
    if (!result.success) {
      throw new BadRequestException({
        message: '参数校验失败',
        ...z.treeifyError(result.error),
      })
    }
    return result.data
  }
}
