<div align="center">

![new-api](/web/public/logo.png)

# EASTCREA

🍥 **Next-Generation LLM Gateway and AI Asset Management System**

<p align="center">
  <a href="./README.zh_CN.md">简体中文</a> |
  <a href="./README.zh_TW.md">繁體中文</a> |
  <strong>English</strong> |
  <a href="./README.fr.md">Français</a> |
  <a href="./README.ja.md">日本語</a>
</p>

<p align="center">
  <a href="https://raw.githubusercontent.com/skylinebear/east-api/main/LICENSE">
    <img src="https://img.shields.io/github/license/skylinebear/east-api?color=brightgreen" alt="license">
  </a><!--
  --><a href="https://github.com/skylinebear/east-api/releases/latest">
    <img src="https://img.shields.io/github/v/release/skylinebear/east-api?color=brightgreen&include_prereleases" alt="release">
  </a><!--
  --><a href="https://github.com/skylinebear/east-api">
    <img src="https://img.shields.io/badge/docker-dockerHub-blue" alt="docker">
  </a><!--
  --><a href="https://goreportcard.com/report/github.com/skylinebear/east-api">
    <img src="https://goreportcard.com/badge/github.com/skylinebear/east-api" alt="GoReportCard">
  </a>
</p>

<p align="center">
  <a href="https://trendshift.io/repositories/20180" target="_blank">
    <img src="https://trendshift.io/api/badge/repositories/20180" alt="skylinebear%2Feast-api | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/>
  </a>
  <br>
  <a href="https://hellogithub.com/repository/skylinebear/east-api" target="_blank">
    <img src="https://api.hellogithub.com/v1/widgets/recommend.svg?rid=539ac4217e69431684ad4a0bab768811&claim_uid=tbFPfKIDHpc4TzR" alt="Featured｜HelloGitHub" style="width: 250px; height: 54px;" width="250" height="54" />
  </a><!--
  --><a href="https://www.producthunt.com/products/new-api/launches/new-api?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-new-api" target="_blank" rel="noopener noreferrer">
    <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1047693&theme=light&t=1769577875005" alt="EASTCREA - All-in-one AI asset management gateway. | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" />
  </a>
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-key-features">Key Features</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-documentation">Documentation</a> •
  <a href="#-help-support">Help</a>
</p>

</div>

## 📝 Project Description

> [!IMPORTANT]
> - This project is for personal learning purposes only, with no guarantee of stability or technical support
> - Users must comply with OpenAI's [Terms of Use](https://openai.com/policies/terms-of-use) and **applicable laws and regulations**, and must not use it for illegal purposes
> - According to the [《Interim Measures for the Management of Generative Artificial Intelligence Services》](http://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm), please do not provide any unregistered generative AI services to the public in China.

---

## 🤝 Trusted Partners

<p align="center">
  <em>No particular order</em>
</p>

<p align="center">
  <a href="https://www.cherry-ai.com/" target="_blank">
    <img src="./docs/images/cherry-studio.png" alt="Cherry Studio" height="80" />
  </a><!--
  --><a href="https://github.com/iOfficeAI/AionUi/" target="_blank">
    <img src="./docs/images/aionui.png" alt="Aion UI" height="80" />
  </a><!--
  --><a href="https://bda.pku.edu.cn/" target="_blank">
    <img src="./docs/images/pku.png" alt="Peking University" height="80" />
  </a><!--
  --><a href="https://www.compshare.cn/?ytag=GPU_yy_gh_newapi" target="_blank">
    <img src="./docs/images/ucloud.png" alt="UCloud" height="80" />
  </a><!--
  --><a href="https://www.aliyun.com/" target="_blank">
    <img src="./docs/images/aliyun.png" alt="Alibaba Cloud" height="80" />
  </a><!--
  --><a href="https://io.net/" target="_blank">
    <img src="./docs/images/io-net.png" alt="IO.NET" height="80" />
  </a>
</p>

---

## 🙏 Special Thanks

<p align="center">
  <a href="https://www.jetbrains.com/?from=new-api" target="_blank">
    <img src="https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.png" alt="JetBrains Logo" width="120" />
  </a>
</p>

<p align="center">
  <strong>Thanks to <a href="https://www.jetbrains.com/?from=new-api">JetBrains</a> for providing free open-source development license for this project</strong>
</p>

---

## 🚀 Quick Start

### Using Docker Compose (Recommended)

```bash
# Clone the project
git clone https://github.com/skylinebear/east-api.git
cd east-api

# Edit docker-compose.yml configuration
nano docker-compose.yml

# Start the service
docker compose up -d --build
```

<details>
<summary><strong>Using Docker Commands</strong></summary>

```bash
# Pull the latest image
docker build -t eastcrea/new-api:local .

# Using SQLite (default)
docker run --name new-api -d --restart always \
  -p 3000:3000 \
  -e TZ=Asia/Shanghai \
  -v ./data:/data \
  eastcrea/new-api:local

# Using MySQL
docker run --name new-api -d --restart always \
  -p 3000:3000 \
  -e SQL_DSN="root:123456@tcp(localhost:3306)/new-api" \
  -e TZ=Asia/Shanghai \
  -v ./data:/data \
  eastcrea/new-api:local
```

> **💡 Tip:** `-v ./data:/data` will save data in the `data` folder of the current directory, you can also change it to an absolute path like `-v /your/custom/path:/data`

</details>

---

🎉 After deployment is complete, visit `http://localhost:3000` to start using!

📖 For more deployment methods, please refer to [Deployment Guide](https://github.com/skylinebear/east-api/tree/main/docs)

---

## 📚 Documentation

<div align="center">

### 📖 [Official Documentation](https://github.com/skylinebear/east-api/tree/main/docs) | [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://github.com/skylinebear/east-api)

</div>

**Quick Navigation:**

| Category | Link |
|------|------|
| 🚀 Deployment Guide | [Installation Documentation](https://github.com/skylinebear/east-api/tree/main/docs) |
| ⚙️ Environment Configuration | [Environment Variables](https://github.com/skylinebear/east-api/tree/main/docs) |
| 📡 API Documentation | [API Documentation](https://github.com/skylinebear/east-api/tree/main/docs) |
| ❓ FAQ | [FAQ](https://github.com/skylinebear/east-api/tree/main/docs) |
| 💬 Community Interaction | [Communication Channels](https://github.com/skylinebear/east-api/tree/main/docs) |

---

## ✨ Key Features

> For detailed features, please refer to [Features Introduction](https://github.com/skylinebear/east-api/tree/main/docs)

### 🎨 Core Functions

| Feature | Description |
|------|------|
| 🎨 New UI | Modern user interface design |
| 🌍 Multi-language | Supports Simplified Chinese, Traditional Chinese, English, French, Japanese |
| 🔄 Data Compatibility | Fully compatible with the original One API database |
| 📈 Data Dashboard | Visual console and statistical analysis |
| 🔒 Permission Management | Token grouping, model restrictions, user management |

### 💰 Payment and Billing

- ✅ Online recharge (EPay, Stripe)
- ✅ Pay-per-use model pricing
- ✅ Cache billing support (OpenAI, Azure, DeepSeek, Claude, Qwen and all supported models)
- ✅ Flexible billing policy configuration

### 🔐 Authorization and Security

- 😈 Discord authorization login
- 🤖 LinuxDO authorization login
- 📱 Telegram authorization login
- 🔑 OIDC unified authentication
- 🔍 Key quota query usage (with [neko-api-key-tool](https://github.com/Calcium-Ion/neko-api-key-tool))

### 🚀 Advanced Features

**API Format Support:**
- ⚡ [OpenAI Responses](https://github.com/skylinebear/east-api/tree/main/docs)
- ⚡ [OpenAI Realtime API](https://github.com/skylinebear/east-api/tree/main/docs) (including Azure)
- ⚡ [Claude Messages](https://github.com/skylinebear/east-api/tree/main/docs)
- ⚡ [Google Gemini](https://github.com/skylinebear/east-api/tree/main/docs)
- 🔄 [Rerank Models](https://github.com/skylinebear/east-api/tree/main/docs) (Cohere, Jina)

**Intelligent Routing:**
- ⚖️ Channel weighted random
- 🔄 Automatic retry on failure
- 🚦 User-level model rate limiting

**Format Conversion:**
- 🔄 **OpenAI Compatible ⇄ Claude Messages**
- 🔄 **OpenAI Compatible → Google Gemini**
- 🔄 **Google Gemini → OpenAI Compatible** - Text only, function calling not supported yet
- 🚧 **OpenAI Compatible ⇄ OpenAI Responses** - In development
- 🔄 **Thinking-to-content functionality**

**Reasoning Effort Support:**

<details>
<summary>View detailed configuration</summary>

**OpenAI series models:**
- `o3-mini-high` - High reasoning effort
- `o3-mini-medium` - Medium reasoning effort
- `o3-mini-low` - Low reasoning effort
- `gpt-5-high` - High reasoning effort
- `gpt-5-medium` - Medium reasoning effort
- `gpt-5-low` - Low reasoning effort

**Claude thinking models:**
- `claude-3-7-sonnet-20250219-thinking` - Enable thinking mode

**Google Gemini series models:**
- `gemini-2.5-flash-thinking` - Enable thinking mode
- `gemini-2.5-flash-nothinking` - Disable thinking mode
- `gemini-2.5-pro-thinking` - Enable thinking mode
- `gemini-2.5-pro-thinking-128` - Enable thinking mode with thinking budget of 128 tokens
- You can also append `-low`, `-medium`, or `-high` to any Gemini model name to request the corresponding reasoning effort (no extra thinking-budget suffix needed).

</details>

---

## 🤖 Model Support

> For details, please refer to [API Documentation - Relay Interface](https://github.com/skylinebear/east-api/tree/main/docs)

| Model Type | Description | Documentation |
|---------|------|------|
| 🤖 OpenAI-Compatible | OpenAI compatible models | [Documentation](https://github.com/skylinebear/east-api/tree/main/docs) |
| 🤖 OpenAI Responses | OpenAI Responses format | [Documentation](https://github.com/skylinebear/east-api/tree/main/docs) |
| 🎨 Midjourney-Proxy | [Midjourney-Proxy(Plus)](https://github.com/novicezk/midjourney-proxy) | [Documentation](https://github.com/skylinebear/east-api/tree/main/docs) |
| 🎵 Suno-API | [Suno API](https://github.com/Suno-API/Suno-API) | [Documentation](https://github.com/skylinebear/east-api/tree/main/docs) |
| 🔄 Rerank | Cohere, Jina | [Documentation](https://github.com/skylinebear/east-api/tree/main/docs) |
| 💬 Claude | Messages format | [Documentation](https://github.com/skylinebear/east-api/tree/main/docs) |
| 🌐 Gemini | Google Gemini format | [Documentation](https://github.com/skylinebear/east-api/tree/main/docs) |
| 🔧 Dify | ChatFlow mode | - |
| 🎯 Custom | Supports complete call address | - |

### 📡 Supported Interfaces

<details>
<summary>View complete interface list</summary>

- [Chat Interface (Chat Completions)](https://github.com/skylinebear/east-api/tree/main/docs)
- [Response Interface (Responses)](https://github.com/skylinebear/east-api/tree/main/docs)
- [Image Interface (Image)](https://github.com/skylinebear/east-api/tree/main/docs)
- [Audio Interface (Audio)](https://github.com/skylinebear/east-api/tree/main/docs)
- [Video Interface (Video)](https://github.com/skylinebear/east-api/tree/main/docs)
- [Embedding Interface (Embeddings)](https://github.com/skylinebear/east-api/tree/main/docs)
- [Rerank Interface (Rerank)](https://github.com/skylinebear/east-api/tree/main/docs)
- [Realtime Conversation (Realtime)](https://github.com/skylinebear/east-api/tree/main/docs)
- [Claude Chat](https://github.com/skylinebear/east-api/tree/main/docs)
- [Google Gemini Chat](https://github.com/skylinebear/east-api/tree/main/docs)

</details>

---

## 🚢 Deployment

> [!TIP]
> **Latest Docker image:** `eastcrea/new-api:local`

### 📋 Deployment Requirements

| Component | Requirement |
|------|------|
| **Local database** | SQLite (Docker must mount `/data` directory)|
| **Remote database** | MySQL ≥ 5.7.8 or PostgreSQL ≥ 9.6 |
| **Container engine** | Docker / Docker Compose |

### ⚙️ Environment Variable Configuration

<details>
<summary>Common environment variable configuration</summary>

| Variable Name | Description | Default Value |
|--------|------|--------|
| `SESSION_SECRET` | Session secret (required for multi-machine deployment) | - |
| `CRYPTO_SECRET` | Encryption secret (required for Redis) | - |
| `SQL_DSN` | Database connection string | - |
| `REDIS_CONN_STRING` | Redis connection string | - |
| `STREAMING_TIMEOUT` | Streaming timeout (seconds) | `300` |
| `STREAM_SCANNER_MAX_BUFFER_MB` | Max per-line buffer (MB) for the stream scanner; increase when upstream sends huge image/base64 payloads | `64` |
| `MAX_REQUEST_BODY_MB` | Max request body size (MB, counted **after decompression**; prevents huge requests/zip bombs from exhausting memory). Exceeding it returns `413` | `32` |
| `AZURE_DEFAULT_API_VERSION` | Azure API version | `2025-04-01-preview` |
| `ERROR_LOG_ENABLED` | Error log switch | `false` |
| `PYROSCOPE_URL` | Pyroscope server address | - |
| `PYROSCOPE_APP_NAME` | Pyroscope application name | `new-api` |
| `PYROSCOPE_BASIC_AUTH_USER` | Pyroscope basic auth user | - |
| `PYROSCOPE_BASIC_AUTH_PASSWORD` | Pyroscope basic auth password | - |
| `PYROSCOPE_MUTEX_RATE` | Pyroscope mutex sampling rate | `5` |
| `PYROSCOPE_BLOCK_RATE` | Pyroscope block sampling rate | `5` |
| `HOSTNAME` | Hostname tag for Pyroscope | `new-api` |

📖 **Complete configuration:** [Environment Variables Documentation](https://github.com/skylinebear/east-api/tree/main/docs)

</details>

### 🔧 Deployment Methods

<details>
<summary><strong>Method 1: Docker Compose (Recommended)</strong></summary>

```bash
# Clone the project
git clone https://github.com/skylinebear/east-api.git
cd east-api

# Edit configuration
nano docker-compose.yml

# Start service
docker compose up -d --build
```

</details>

<details>
<summary><strong>Method 2: Docker Commands</strong></summary>

**Using SQLite:**
```bash
docker build -t eastcrea/new-api:local .

docker run --name new-api -d --restart always \
  -p 3000:3000 \
  -e TZ=Asia/Shanghai \
  -v ./data:/data \
  eastcrea/new-api:local
```

**Using MySQL:**
```bash
docker run --name new-api -d --restart always \
  -p 3000:3000 \
  -e SQL_DSN="root:123456@tcp(localhost:3306)/new-api" \
  -e TZ=Asia/Shanghai \
  -v ./data:/data \
  eastcrea/new-api:local
```

> **💡 Path explanation:**
> - `./data:/data` - Relative path, data saved in the data folder of the current directory
> - You can also use absolute path, e.g.: `/your/custom/path:/data`

</details>

<details>
<summary><strong>Method 3: BaoTa Panel</strong></summary>

1. Install BaoTa Panel (≥ 9.2.0 version)
2. Search for **New-API** in the application store
3. One-click installation

📖 [Tutorial with images](./docs/BT.md)

</details>

### ⚠️ Multi-machine Deployment Considerations

> [!WARNING]
> - **Must set** `SESSION_SECRET` - Otherwise login status inconsistent
> - **Shared Redis must set** `CRYPTO_SECRET` - Otherwise data cannot be decrypted

### 🔄 Channel Retry and Cache

**Retry configuration:** `Settings → Operation Settings → General Settings → Failure Retry Count`

**Cache configuration:**
- `REDIS_CONN_STRING`: Redis cache (recommended)
- `MEMORY_CACHE_ENABLED`: Memory cache

---

## 🔗 Related Projects

### Upstream Projects

| Project | Description |
|------|------|
| [One API](https://github.com/songquanpeng/one-api) | Original project base |
| [Midjourney-Proxy](https://github.com/novicezk/midjourney-proxy) | Midjourney interface support |

### Supporting Tools

| Project | Description |
|------|------|
| [neko-api-key-tool](https://github.com/Calcium-Ion/neko-api-key-tool) | Key quota query tool |

---

## 💬 Help Support

### 📖 Documentation Resources

| Resource | Link |
|------|------|
| 📘 FAQ | [FAQ](https://github.com/skylinebear/east-api/tree/main/docs) |
| 💬 Community Interaction | [Communication Channels](https://github.com/skylinebear/east-api/tree/main/docs) |
| 🐛 Issue Feedback | [Issue Feedback](https://github.com/skylinebear/east-api/tree/main/docs) |
| 📚 Complete Documentation | [Official Documentation](https://github.com/skylinebear/east-api/tree/main/docs) |

### 🤝 Contribution Guide

Welcome all forms of contribution!

- 🐛 Report Bugs
- 💡 Propose New Features
- 📝 Improve Documentation
- 🔧 Submit Code

---

## 📜 License

This project is licensed under the [GNU Affero General Public License v3.0 (AGPLv3)](./LICENSE).

This is an open-source project developed based on [One API](https://github.com/songquanpeng/one-api) (MIT License).


---

## 🌟 Star History

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=skylinebear/east-api&type=Date)](https://star-history.com/#skylinebear/east-api&Date)

</div>

---

<div align="center">

### 💖 Thank you for using EASTCREA

If this project is helpful to you, welcome to give us a ⭐️ Star！

**[Official Documentation](https://github.com/skylinebear/east-api/tree/main/docs)** • **[Issue Feedback](https://github.com/skylinebear/east-api/issues)** • **[Latest Release](https://github.com/skylinebear/east-api/releases)**

<sub>Built with ❤️ by skylinebear</sub>

</div>
