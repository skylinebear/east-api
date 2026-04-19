# 宝塔面板部署教程

本文档提供使用宝塔面板部署 `skylinebear/east-api` 的落地步骤。

> 📖 相关文档：
> - [安装与部署索引](./README.md)
> - [标准云服务器部署](./server.md)
> - [域名与 HTTPS 生产部署](./production.md)

***

## 前置要求

| 项目    | 要求                                 |
| ----- | ---------------------------------- |
| 宝塔面板  | ≥ 9.2.0 版本                         |
| 推荐系统  | CentOS 7+、Ubuntu 18.04+、Debian 10+ |
| 服务器配置 | 至少 1 核 2G 内存                       |

***

## 步骤一：安装宝塔面板

1. 前往 [宝塔面板官网](https://www.bt.cn/new/download.html) 下载适合您系统的安装脚本
2. 运行安装脚本安装宝塔面板
3. 安装完成后，使用提供的地址、用户名和密码登录宝塔面板

***

## 步骤二：安装 Docker

1. 登录宝塔面板后，在左侧菜单栏找到并点击 **Docker**
2. 首次进入会提示安装 Docker 服务，点击 **立即安装**
3. 按照提示完成 Docker 服务的安装

***

## 步骤三：部署 EASTCREA

### 方法一：使用 Docker Compose（推荐）

1. 在宝塔面板中创建网站目录，如 `/www/wwwroot/east-api`
2. 克隆你自己的源码，或把当前仓库上传到服务器：

```bash
cd /www/wwwroot
git clone https://github.com/skylinebear/east-api.git
cd east-api
cp .env.example .env
```

3. 按需修改 `.env` 中的数据库、Redis、密钥和 `SERVER_ADDRESS` 配置，然后启动：

```bash
docker compose up -d --build
```

4. 如果只是临时测试，可直接访问 `http://您的服务器IP:3000`

### 方法二：使用宝塔站点反向代理（生产推荐）

1. 将 `docker-compose.yml` 中的端口映射改为：

```yaml
ports:
  - "127.0.0.1:3000:3000"
```

2. 重新启动容器：

```bash
docker compose up -d --build
```

3. 在宝塔中创建站点，例如 `api.example.com`
4. 进入站点设置，添加反向代理，目标地址填写：

```text
http://127.0.0.1:3000
```

5. 在站点 SSL 页面申请 Let’s Encrypt 证书
6. 通过 `https://你的域名/setup` 完成系统初始化

***

## 配置说明

### 必要环境变量

| 变量名                 | 说明                 | 是否必填   |
| ------------------- | ------------------ | ------ |
| `SESSION_SECRET`    | 会话密钥，多机部署必须一致      | **必填** |
| `CRYPTO_SECRET`     | 加密密钥，使用 Redis 时必填  | 条件必填   |
| `SERVER_ADDRESS`    | 站点对外访问地址，建议填写域名   | 生产推荐 |
| `SQL_DSN`           | 数据库连接字符串（使用外部数据库时） | 可选     |
| `REDIS_CONN_STRING` | Redis 连接字符串        | 可选     |

### 生成随机密钥

```bash
# 生成 SESSION_SECRET
openssl rand -hex 16

# 或使用 Linux 命令
head -c 16 /dev/urandom | xxd -p
```

***

## 常见问题

### Q1：无法访问 3000 端口？

1. 检查服务器防火墙是否开放 3000 端口
2. 在宝塔面板 **安全** 中放行 3000 端口
3. 检查云服务器安全组是否开放端口

如果你已经改为 `127.0.0.1:3000:3000`，那么外网无法直接访问 `3000` 是正常现象，此时应通过站点反向代理后的域名访问。

### Q2：登录后提示会话失效？

确保设置了 `SESSION_SECRET` 环境变量，且值不为空。

### Q3：数据如何持久化？

使用 Docker 卷映射数据目录：

```yaml
volumes:
  - ./data:/data
```

### Q4：如何更新版本？

```bash
# 拉取你自己的最新代码
git pull

# 重新构建并重启
docker compose down && docker compose up -d --build
```

***

## 相关链接

- [安装与部署索引](./README.md)
- [标准云服务器部署](./server.md)
- [域名与 HTTPS 生产部署](./production.md)
- [GitHub 仓库](https://github.com/skylinebear/east-api)

***

## 截图示例

![宝塔面板 Docker 安装](https://github.com/user-attachments/assets/7a6fc03e-c457-45e4-b8f9-184508fc26b0)

> ⚠️ 注意：密钥为环境变量 `SESSION_SECRET`，请务必设置！
