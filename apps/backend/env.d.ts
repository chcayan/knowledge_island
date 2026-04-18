declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    ORIGIN?: string
    CORS_ORIGIN: string
    CORS_ORIGIN_1: string
    SERVER_HOST?: string
    PORT?: string
    SECRET_KEY: string
    JWT_SECRET: string
    DB_HOST: string
    DB_USER: string
    DB_PASSWORD: string
    DB_NAME: string
    API_KEY: string
    REDIS_HOST: string
    REDIS_PORT: string
    REDIS_PASSWORD: string
    ACCESS_SECRET: string
    REFRESH_SECRET: string
  }
}

declare namespace Express {
  interface Request {
    user?: { id: string }
  }
}
