import { BadRequestException, PipeTransform } from '@nestjs/common'
import { z } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: z.ZodType) {}

  transform(value: any) {
    const result = this.schema.safeParse(value)
    if (!result.success) {
      throw new BadRequestException({
        message: 'fail',
        ...z.treeifyError(result.error),
      })
    }
    return result.data
  }
}
