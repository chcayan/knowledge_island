import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ResponseInterceptor } from './common/interceptor/response.interceptor'
import { Logger } from '@nestjs/common'
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())

  app.useGlobalInterceptors(new ResponseInterceptor())

  app.enableCors({
    origin: (
      origin: string,
      callback: (err: Error | null, origin?: boolean) => void
    ) => {
      const allowedOrigins = [
        process.env.CORS_ORIGIN,
        process.env.CORS_ORIGIN_1,
      ]
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.startsWith('http://localhost')
      ) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  app.setGlobalPrefix('api')

  await app.listen(process.env.PORT ?? 8080)

  Logger.log('当前环境：' + process.env.NODE_ENV)
}
void bootstrap()
