# 安装与部署

这部分文档用于指导 `skylinebear/east-api` 的实际部署，不依赖任何上游镜像仓库。

## 文档索引

- [标准云服务器部署](./server.md)
  适用于 Ubuntu / Debian 等常见 Linux 云服务器，使用 Docker Compose 直接启动服务。
- [域名与 HTTPS 生产部署](./production.md)
  适用于已有域名，希望通过 Nginx 反向代理并启用 HTTPS 的生产环境。
- [宝塔面板部署](./BT.md)
  适用于使用宝塔面板管理站点和反向代理的场景。

## 推荐路径

如果你只是想尽快跑起来：

1. 先看 [标准云服务器部署](./server.md)
2. 有域名后再看 [域名与 HTTPS 生产部署](./production.md)

如果你本来就使用宝塔面板：

1. 先看 [宝塔面板部署](./BT.md)
2. 同时参考 [域名与 HTTPS 生产部署](./production.md) 中关于反向代理和证书的建议

## 统一原则

- 部署仓库统一使用 `https://github.com/skylinebear/east-api.git`
- 建议先复制 `.env.example` 为 `.env`，再填写密码、密钥和 `SERVER_ADDRESS`
- 容器镜像统一由当前源码仓库本地构建，不要执行任何上游镜像拉取命令
- 生产环境建议只对外开放 `80` 和 `443`，不要长期暴露 `3000`
- `SESSION_SECRET` 和 `CRYPTO_SECRET` 必须自行生成并替换为高强度随机值
- 不要执行 `docker compose down -v`，否则会一并删除数据库卷
