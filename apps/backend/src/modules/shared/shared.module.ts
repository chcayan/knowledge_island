import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Image } from './entities/image.entity'
import { SharedService } from './shared.service'

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  controllers: [],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {}
