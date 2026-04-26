/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import dotenv from 'dotenv'
import { resolve } from 'path'
import { DataSource } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

const envFileMap: Record<string, string> = {
  development: '.env.development',
  production: '.env.production',
}

const env = process.env.NODE_ENV ?? 'development'

dotenv.config({
  path: resolve(process.cwd(), envFileMap[env] || '.env.development'),
})

console.log(`当前环境：${env}`)

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST!,
  port: 3306,
  username: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,

  entities: [__dirname + '/**/*.entity{.js,.ts}'],
  migrations: ['src/migrations/*-init.ts'],

  namingStrategy: new SnakeNamingStrategy(),
})
