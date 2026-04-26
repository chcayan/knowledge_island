import { Controller } from '@nestjs/common'
import { DraftService } from './draft.service'

@Controller('draft')
export class DraftController {
  constructor(private readonly draftService: DraftService) {}
}
