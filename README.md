# Knowledge Island (知岛)

[English](./README.en.md) | 中文

知岛是一个开放的问答与知识分享社区。

该项目使用 monorepo 进行项目管理。

目前项目正在建设中...

---

## 技术栈

### 前端：

- next.js
- typescript

### 后端：

- nest.js
- mysql
- redis

## 运行

1. 安装依赖

```bash
pnpm i
```

2. 修改后端配置 (apps/backend/.env.development)

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_pwd
DB_NAME=your_db_name
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_pwd
```

3. 初始化数据库

```bash
pnpm create:db
```

后续若有修改 entity 则执行

```bash
pnpm update:db
```

4. 构建 packages

```bash
pnpm build:packages
```

5. 启动服务

```bash
pnpm start:backend
pnpm dev:frontend
```

## 项目结构

    knowledge_island/
    ├── apps/                    # 应用
    │   ├── backend/             # 后端服务
    │   └── frontend/            # web 应用
    ├── docs/                    # 文档
    │   └── version/             # 应用版本说明
    └── packages/                # 公共模块
        ├── error/               # 错误状态码
        ├── lexical/             # lexical nodes
        ├── schemas/             # zod
        └── utils/               # 工具函数

## 版本

- [web](./docs/md/version/zh/web.md)
