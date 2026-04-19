# 标准云服务器部署

本文档适用于在 Ubuntu / Debian 等 Linux 云服务器上部署 `skylinebear/east-api`。

## 一、前置要求

建议最低配置：

- 1 核 CPU
- 2 GB 内存
- 20 GB 可用磁盘

需要提前准备：

- 一台可 SSH 登录的 Linux 云服务器
- 已放行 `22` 端口
- 测试阶段如需直接访问服务，可临时放行 `3000`

## 二、安装基础环境

```bash
sudo apt update
sudo apt install -y git docker.io docker-compose-plugin
sudo systemctl enable --now docker
```

确认版本：

```bash
docker --version
docker compose version
git --version
```

## 三、拉取项目源码

```bash
cd /opt
sudo git clone https://github.com/skylinebear/east-api.git
sudo chown -R $USER:$USER /opt/east-api
cd /opt/east-api
```

## 四、修改部署配置

编辑 `docker-compose.yml`：

```bash
nano docker-compose.yml
```

至少需要修改以下值：

- `POSTGRES_PASSWORD`
- Redis 的 `--requirepass`
- `REDIS_CONN_STRING`
- `SESSION_SECRET`
- `CRYPTO_SECRET`
- `NODE_NAME`

生成随机密钥：

```bash
openssl rand -hex 32
```

推荐写法示例：

```yaml
environment:
  - SQL_DSN=postgresql://root:your-postgres-password@postgres:5432/new-api
  - REDIS_CONN_STRING=redis://:your-redis-password@redis:6379
  - TZ=Asia/Shanghai
  - NODE_NAME=east-api-node-1
  - SESSION_SECRET=replace-with-random-secret
  - CRYPTO_SECRET=replace-with-random-secret
```

## 五、启动服务

```bash
docker compose up -d --build
```

检查状态：

```bash
docker compose ps
docker compose logs -f new-api
```

如果日志持续正常输出，浏览器访问：

```text
http://服务器公网IP:3000
```

首次初始化通常访问：

```text
http://服务器公网IP:3000/setup
```

## 六、首次上线后的检查项

- 是否能打开登录页
- 是否能完成管理员初始化
- 是否能正常登录控制台
- 是否能创建令牌
- 是否能保存渠道配置

## 七、更新方式

后续更新：

```bash
cd /opt/east-api
git pull
docker compose up -d --build
```

## 八、常用命令

查看全部日志：

```bash
docker compose logs -f
```

重启服务：

```bash
docker compose restart
```

停止服务：

```bash
docker compose down
```

## 九、注意事项

- 不要执行 `docker pull calciumion/new-api:latest` 之类的命令
- 不要执行 `docker compose down -v`
- 如果准备上生产，请继续参考 [域名与 HTTPS 生产部署](./production.md)
- 如果你使用宝塔，请参考 [宝塔面板部署](./BT.md)
