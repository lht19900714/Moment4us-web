# Moment4us 生产部署指南

## 前提条件

- Cloudflare 账号（域名已在 Cloudflare 管理）
- Node.js + pnpm 已安装
- `wrangler` CLI 已登录（`npx wrangler login`）

---

## 第 1 步：创建 D1 数据库

```bash
cd apps/web
npx wrangler d1 create moment4us-db
```

命令输出会包含 `database_id`，类似：
```
✅ Successfully created DB 'moment4us-db'
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**将 `database_id` 记录到 `.secrets.production` 文件中。**

然后更新 `apps/web/wrangler.jsonc`，把 `<your-d1-database-id>` 替换为实际的 ID。

## 第 2 步：创建 R2 Bucket

```bash
npx wrangler r2 bucket create moment4us-images
```

R2 bucket 名称已在 `wrangler.jsonc` 中配置为 `moment4us-images`，无需额外修改。

## 第 3 步：创建 Turnstile Widget

在 Cloudflare Dashboard 操作：

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 左侧菜单点击 **Turnstile**
3. 点击 **Add widget**
4. 填写：
   - **Widget name**: `Moment4us Contact Form`
   - **Domains**: 添加你的域名（如 `moment4us.com`）和 `localhost`（用于本地测试）
   - **Widget Mode**: 选择 **Managed**（推荐）
5. 点击 **Create**
6. 创建后会显示：
   - **Site Key**（公开的，嵌入前端）
   - **Secret Key**（私密的，服务端验证）

**将两个 key 记录到 `.secrets.production` 文件中。**

然后更新 `apps/web/wrangler.jsonc`，把 `<your-turnstile-site-key>` 替换为实际的 Site Key。

## 第 4 步：运行生产数据库迁移

```bash
cd apps/web
npx wrangler d1 migrations apply moment4us-db --remote
```

这会在远程 D1 数据库中创建所有表并插入种子数据。

## 第 5 步：设置 Secrets

```bash
cd apps/web

# Admin 密码哈希
echo "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92" | npx wrangler secret put ADMIN_PASSWORD_HASH

# Turnstile 密钥（替换为实际值）
echo "<你的-turnstile-secret-key>" | npx wrangler secret put TURNSTILE_SECRET_KEY

# 工作室邮箱（接收询盘通知）
echo "<你的邮箱>" | npx wrangler secret put STUDIO_EMAIL
```

## 第 6 步：构建与部署

```bash
# 在项目根目录
pnpm --filter @moment4us/web build
cd apps/web
npx wrangler deploy
```

部署成功后会输出 Worker URL，类似：
```
✅ Published moment4us-web
  https://moment4us-web.<your-subdomain>.workers.dev
```

## 第 7 步：配置自定义域名

在 Cloudflare Dashboard 操作：

1. 进入 **Workers & Pages**
2. 找到 `moment4us-web` worker，点击进入
3. 点击 **Settings** 标签
4. 找到 **Domains & Routes** 部分
5. 点击 **Add** → **Custom Domain**
6. 输入你的域名（如 `moment4us.com` 或 `www.moment4us.com`）
7. Cloudflare 会自动配置 DNS 记录

---

## 部署后验证清单

- [ ] 访问首页正常加载
- [ ] About 和 Services 页面正常
- [ ] Portfolio 页面图片显示（Unsplash 占位图）
- [ ] Contact 表单可以提交（Turnstile 验证通过）
- [ ] `/admin/login` 可以用密码登录
- [ ] Admin Dashboard 显示统计数据
- [ ] 提交的询盘出现在 Admin Leads 列表

---

## 后续可选配置

### Cloudflare Images（替换 Unsplash 占位图）

1. Dashboard → **Images** → 开通 Cloudflare Images
2. 获取 Account Hash（在 Images 页面的 URL 中可以看到）
3. 在 Worker 设置中添加环境变量：
   - `CLOUDFLARE_IMAGES_ACCOUNT_HASH` = 你的 hash
   - `CLOUDFLARE_IMAGES_VARIANT` = `public`

### Email Routing（实际发送询盘通知邮件）

1. Dashboard → **Email Routing** → 配置
2. 添加验证目标邮箱
3. 创建 Email Worker 或使用 send_email binding
