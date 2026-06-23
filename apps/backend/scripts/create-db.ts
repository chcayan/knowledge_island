import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import { resolve } from 'path'

const envFileMap: Record<string, string> = {
  development: '.env.development',
  production: '.env.production',
}

const env = process.env.NODE_ENV ?? 'development'

dotenv.config({
  path: resolve(process.cwd(), envFileMap[env] || '.env.development'),
})

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  })

  await conn.query(`
    CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci
  `)

  await conn.end()

  console.log('database create success')
}

void main()
