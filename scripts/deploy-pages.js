// 将 pack 产物部署到 Cloudflare Pages。
// 用法：node scripts/deploy-pages.js <project-name>
// 默认目录：os.tmpdir()/daiyin-pages（与 pack-rianthai.js 一致）
const { spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const project = process.argv[2];
if (!project) {
  console.error("用法: node scripts/deploy-pages.js <project-name>");
  process.exit(1);
}

const dest = process.argv[3] || path.join(os.tmpdir(), "daiyin-pages");
if (!fs.existsSync(path.join(dest, "index.html"))) {
  console.error("未找到打包产物: " + dest);
  console.error("请先运行: npm run pack");
  process.exit(1);
}

const args = [
  "--yes",
  "wrangler@4",
  "pages",
  "deploy",
  dest,
  "--project-name",
  project,
  "--commit-dirty=true"
];

console.log("deploying " + dest + " -> Cloudflare Pages project " + project);
const result = spawnSync("npx", args, { stdio: "inherit", shell: process.platform === "win32" });
if (result.error) {
  console.error(result.error.message);
  console.error("需要已登录的 wrangler（CLOUDFLARE_API_TOKEN 或 wrangler login）。");
  process.exit(1);
}
process.exit(result.status == null ? 1 : result.status);
