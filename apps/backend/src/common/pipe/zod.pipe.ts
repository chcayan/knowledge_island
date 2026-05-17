import { ERROR_CODE, ERROR_MESSAGE } from '@knowledge_island/error'
import { BadRequestException, PipeTransform } from '@nestjs/common'
import { z } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: z.ZodType) {}

  transform(value: any) {
    const result = this.schema.safeParse(value)
    if (!result.success) {
      throw new BadRequestException({
        code: ERROR_CODE.BAD_REQUEST,
        message: ERROR_MESSAGE[ERROR_CODE.BAD_REQUEST],
        data: {
          ...z.treeifyError(result.error),
        },
      })
    }
    return result.data
  }
}
