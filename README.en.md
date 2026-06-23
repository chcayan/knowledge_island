# Knowledge Island

English | [中文](./README.md)

Knowledge Island is an open Q&A and knowledge sharing community.

This project uses Monorepo for project management.

The project is currently under construction ..

---

## Tech stack

### frontend:

- next.js
- typescript

### backend:

- nest.js
- mysql
- redis

## Run

1. Install dependencies.

```bash
pnpm i
```

2. Modify backend configuration.(apps/backend/.env.development)

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_pwd
DB_NAME=your_db_name
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_pwd
```

3. Initialize database.

```bash
pnpm create:db
```

If there are any modifications to the entity in the future, execute them

```bash
pnpm update:db
```

4. Build packages.

```bash
pnpm build:packages
```

5. Start service.

```bash
pnpm start:backend
pnpm dev:frontend
```

## Project structure

    knowledge_island/
    ├── apps/                    # Apps
    │   ├── backend/             # Backend service
    │   └── frontend/            # Web
    ├── docs/                    # Document
    │   └── version/             # Application version description
    └── packages/                # Common
        ├── error/               # Error status code
        ├── lexical/             # Lexical nodes
        ├── schemas/             # Zod
        └── utils/               # Utility

## Version

- [web](./docs/md/version/en/web.md)
