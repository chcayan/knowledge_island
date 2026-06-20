import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ResponseInterceptor } from './common/interceptor/response.interceptor'
import { Logger } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import { DataSource } from 'typeorm'

async function createDatabase() {
  const ds = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  })

  await ds.initialize()

  await ds.query(`
    CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci
  `)

  await ds.destroy()
}

async function bootstrap() {
  await createDatabase()

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
  await app.listen(process.env.PORT ?? 8080)

  Logger.log('当前环境：' + process.env.NODE_ENV)
}
void bootstrap()
