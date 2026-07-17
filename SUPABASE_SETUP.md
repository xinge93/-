# Supabase 云端项目管理接入

项目管理已改为 Supabase Auth、Postgres 和 Storage。公开访客仍能浏览作品；只有指定管理员账号可登录、上传和删除项目。

## 1. 创建 Supabase 项目和管理员账号

1. 在 Supabase Dashboard 新建一个项目。
2. 打开 `Authentication` -> `Providers`，确认 `Email` 登录已启用。
3. 在 `Authentication` -> `Users` 中创建你的管理员账号，并设置密码。
4. 如果不希望任何人注册，在 `Authentication` -> `Providers` 中关闭公开注册。

## 2. 初始化数据库和图片存储

1. 打开项目的 `SQL Editor`。
2. 复制 [supabase/schema.sql](/Users/lee/Documents/作品集/supabase/schema.sql) 的全部内容。
3. 将文件中的 `REPLACE_WITH_YOUR_ADMIN_EMAIL` 全部替换为管理员登录邮箱，然后执行。

脚本会创建 `projects` 数据表、`project-assets` 图片桶和访问规则。

## 3. 添加本地环境变量

在项目根目录新建 `.env.local`，参考 `.env.example`：

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_ADMIN_EMAIL=your-admin-email@example.com
```

`VITE_SUPABASE_PUBLISHABLE_KEY` 可在 `Project Settings` -> `API Keys` 获取。只能使用 publishable/anon key，不能把 `service_role` 密钥放进前端。

## 4. 启动并部署

本地改完变量后，重启开发服务：

```bash
npm run dev
```

部署平台也要添加同名的三项环境变量，然后重新部署。登录后在导航右侧进入“项目管理”，即可上传封面、信息和详情图片。
