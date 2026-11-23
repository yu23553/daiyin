# ThaiStudyWeb（RianThai / Daiyin）

泰语学习站点。本仓库由公开仓库 [yu23553/daiyin](https://github.com/yu23553/daiyin) 完整迁入，作为 Origin 上的工作代码库。

线上入口：

- https://rianthai.pages.dev
- https://daiyin.pages.dev（与 rianthai 同一产物，双项目部署）

账号同步 API：https://daiyin-study.netlify.app

## 功能概览

闪卡、词本、SRS、测验、星标/自定义词本、TTS、FSI 课文、音标入门、主题切换、账号进度同步等。入口以当前线上 `index.html` 为准：加载动态核心包 `js/rianthai.js`（由 `content / speech / store / account / course* / study` 组成），词库按等级按需加载 `lexpack-*.js`，FSI / 音标按需加载。

`js/app.js` 为可选旧课程 UI，**不在**当前线上入口中引用；保留在仓库内便于对照与实验。

## 本地运行

需要 Node.js。在项目根目录：

```bash
npm start
# 或：node js/serve.js
```

浏览器打开：**http://127.0.0.1:8765**

本地服务会把核心 JS 动态拼成 `js/rianthai.js`，改完源文件刷新即可，无需先 pack。修改词库源文件（`js/lexicon*.js`）后须重新 pack，以更新 `js/lexpack-*.js`。

Windows 也可双击 `start.bat`。

## 打包与发布

发布前 bump 缓存版本：

1. 在 `index.html` 中把资源上的 `?v=N` 与 `window.RT_VERSION` 改成新数字（例如 95 → 96）。
2. 打包并双部署：

```bash
npm run pack          # 生成词库包 + 临时目录核心包
npm run deploy        # pack + deploy:rianthai + deploy:daiyin
```

`npm run pack` 默认写出到系统临时目录下的 `daiyin-pages`（与 `os.tmpdir()` 一致），并刷新工作区里的 `js/lexpack-*.js`。也可指定目录：`node scripts/pack-rianthai.js /path/to/out`。

验证：打开 `https://rianthai.pages.dev/?t=N`（N 为新版本号）。

### Cloudflare 凭证

`deploy:*` 通过 `npx wrangler@4 pages deploy` 发布，需要本机已配置：

- `CLOUDFLARE_API_TOKEN`（推荐），或
- 已执行过 `npx wrangler login`

本仓库迁移 **不要求** CI/PR 具备 Cloudflare 密钥；缺密钥时代码与脚本仍可用，本机有凭证后再执行 `npm run deploy`。

账号 API 部署在 Netlify（`netlify.toml` + `netlify/functions`），生产指向 `daiyin-study.netlify.app`；前端 `js/account.js` 默认请求该源。

## localStorage 键（勿改名）

| 键 | 用途 |
| --- | --- |
| `daiyin-books-v1` | 词本/主题等 UI 本地状态 |
| `daiyin-thai-v1` | 学习进度（SRS 等） |
| `daiyin-account-v1` | 账号会话 |
| `daiyin-boot-quote` | 启动页金句轮换下标 |

## 主要目录

| 路径 | 说明 |
| --- | --- |
| `index.html` | 入口；版本号 `?v=` / `RT_VERSION` |
| `css/app.css` | 样式 |
| `js/study.js` | 主 UI 与学习逻辑 |
| `js/course*.js` | 课程 |
| `js/lexicon*.js` | 词库源（编辑后需 pack） |
| `js/lexpack-*.js` | 按等级打包的词库（pack 生成） |
| `js/phonics.js` / `js/fsi.js` | 音标 / FSI，按需加载 |
| `js/serve.js` | 本地 8765 调试服务 |
| `js/app.js` | 可选旧入口，非线上默认 |
| `scripts/pack-rianthai.js` | 打包 |
| `scripts/deploy-pages.js` | 跨平台 Cloudflare Pages 部署 |
| `netlify/` | 账号同步 Functions |

## 远程与同源

| 用途 | 地址 |
| --- | --- |
| 源仓库（迁移来源） | https://github.com/yu23553/daiyin |
| 生产（Cloudflare） | https://rianthai.pages.dev 、 https://daiyin.pages.dev |
| 账号 API（Netlify） | https://daiyin-study.netlify.app |
