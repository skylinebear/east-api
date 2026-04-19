# 域名与 HTTPS 生产部署

本文档适用于将 `skylinebear/east-api` 部署到生产环境，并通过域名、Nginx 和 HTTPS 提供访问。

示例域名：

```text
api.example.com
```

## 一、前置条件

- 已完成 [标准云服务器部署](./server.md)
- 域名已解析到服务器公网 IP
- 云服务器安全组已放行 `80` 和 `443`

正式环境建议关闭公网 `3000`，仅保留本机访问。

## 二、将应用端口限制为本机访问

编辑 `docker-compose.yml`，把：

```yaml
ports:
  - "3000:3000"
```

改成：

```yaml
ports:
  - "127.0.0.1:3000:3000"
```

重新启动：

```bash
docker compose up -d --build
```

## 三、安装 Nginx 与证书工具

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
sudo systemctl enable --now nginx
```

## 四、配置 Nginx 反向代理

创建站点配置：

```bash
sudo nano /etc/nginx/sites-available/east-api
```

写入以下内容，并将 `api.example.com` 替换为你的真实域名：

```nginx
server {
    listen 80;
    server_name api.example.com;

    client_max_body_size 50m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/east-api /etc/nginx/sites-enabled/east-api
sudo nginx -t
sudo systemctl reload nginx
```

## 五、申请 HTTPS 证书

```bash
sudo certbot --nginx -d api.example.com
```

证书申请完成后，访问：

```text
https://api.example.com
```

首次初始化：

```text
https://api.example.com/setup
```

## 六、证书续期检查

Certbot 默认会自动续期，建议手动验证一次：

```bash
sudo certbot renew --dry-run
```

## 七、更新方式

```bash
cd /opt/east-api
git pull
docker compose up -d --build
sudo nginx -t
sudo systemctl reload nginx
```

## 八、生产环境建议

- 只对外开放 `80` 和 `443`
- `3000` 只监听 `127.0.0.1`
- 为数据库和 Redis 使用强密码
- 妥善保存 `SESSION_SECRET` 和 `CRYPTO_SECRET`
- 更新前先确认服务器磁盘空间充足

## 九、常见问题

### 1. 域名可以打开，但返回 502

通常说明应用容器未正常启动，先检查：

```bash
docker compose ps
docker compose logs -f new-api
```

### 2. Certbot 申请证书失败

通常是以下原因之一：

- 域名还没正确解析到当前服务器
- `80` 端口未放行
- Nginx 配置未生效

### 3. 升级后页面打不开

先确认前端构建和容器重启是否成功：

```bash
docker compose up -d --build
docker compose logs -f new-api
```
