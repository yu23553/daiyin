// 打包 RianThai：核心包 + 按等级拆分的词库包；部署产物自动注入缓存版本号。
// 用法：node scripts/pack-rianthai.js [dest]
// 不传 dest 时默认写到系统临时目录 daiyin-pages
const fs = require("fs");
const path = require("path");
const os = require("os");
const vm = require("vm");
const crypto = require("crypto");

const dest = process.argv[2] || path.join(os.tmpdir(), "daiyin-pages");

const LEX_FILES = [
  "lexicon.js", "lexicon-add.js", "lexicon-a1.js", "lexicon-a2.js", "lexicon-a2b.js",
  "lexicon-b1.js", "lexicon-b2.js", "lexicon-fill.js", "lexicon-bmore.js",
  "lexicon-g1.js", "lexicon-g2.js", "lexicon-g3.js",
  "lexicon-std.js", "lexicon-std2.js", "lexicon-std3.js", "lexicon-std4.js",
  "lexicon-deep.js"
];
const CORE_FILES = [
  "content.js", "speech.js", "store.js", "account.js",
  "course.js", "course-more.js", "course-deep.js", "course-grammar.js", "course-cover.js", "study.js"
];
const LEVELS = ["A1", "A2", "B1", "B2"];

const sandbox = { window: {}, console: console };
vm.createContext(sandbox);
function syncGlobals() {
  ["LEXICON", "LEXICON_PUT", "COURSE", "THAI"].forEach(function (key) {
    if (sandbox.window[key] && sandbox[key] !== sandbox.window[key]) sandbox[key] = sandbox.window[key];
    if (sandbox[key] && !sandbox.window[key]) sandbox.window[key] = sandbox[key];
  });
}
LEX_FILES.forEach(function (name) {
  vm.runInContext(fs.readFileSync(path.join("js", name), "utf8"), sandbox, { filename: name });
  syncGlobals();
});

const lexicon = sandbox.window.LEXICON;
if (!lexicon || !Array.isArray(lexicon.words)) {
  console.error("lexicon load failed");
  process.exit(1);
}
const byLevel = {};
LEVELS.forEach(function (level) { byLevel[level] = []; });
lexicon.words.forEach(function (word) {
  if (byLevel[word.level]) byLevel[word.level].push(word);
});
const total = LEVELS.reduce(function (sum, level) { return sum + byLevel[level].length; }, 0);
console.log("words total " + lexicon.words.length + ", packed " + total + " " +
  LEVELS.map(function (level) { return level + "=" + byLevel[level].length; }).join(" "));

function packSource(level, words) {
  return "(function () {\n" +
    "  window.LEXICON = window.LEXICON || { system: " + JSON.stringify(lexicon.system || "Paiboon+") + ", words: [] };\n" +
    "  window.LEXICON.words = window.LEXICON.words || [];\n" +
    "  window.LEXICON_PARTS = window.LEXICON_PARTS || {};\n" +
    "  if (window.LEXICON_PARTS." + level + ") return;\n" +
    "  window.LEXICON_PARTS." + level + " = true;\n" +
    "  window.LEXICON.words = window.LEXICON.words.concat(" + JSON.stringify(words) + ");\n" +
    "})();\n";
}

fs.mkdirSync(path.join(dest, "js"), { recursive: true });
fs.mkdirSync(path.join(dest, "css"), { recursive: true });
const lexBodies = {};
LEVELS.forEach(function (level) {
  const source = packSource(level, byLevel[level]);
  const name = "lexpack-" + level.toLowerCase() + ".js";
  lexBodies[name] = source;
  fs.writeFileSync(path.join("js", name), source);
  fs.writeFileSync(path.join(dest, "js", name), source);
  console.log(name + " " + Math.round(source.length / 1024) + "KB");
});

const body = CORE_FILES.map(function (name) {
  return fs.readFileSync(path.join("js", name), "utf8");
}).join("\n");
fs.writeFileSync(path.join(dest, "js", "rianthai.js"), body);
console.log("rianthai.js " + Math.round(body.length / 1024) + "KB");

const cssBody = fs.readFileSync(path.join("css", "app.css"), "utf8");
fs.writeFileSync(path.join(dest, "css", "app.css"), cssBody);
["fsi.js", "phonics.js"].forEach(function (name) {
  fs.copyFileSync(path.join("js", name), path.join(dest, "js", name));
});

const hash = crypto.createHash("sha1");
hash.update(body);
Object.keys(lexBodies).sort().forEach(function (name) { hash.update(lexBodies[name]); });
hash.update(cssBody);
hash.update(fs.readFileSync(path.join("js", "fsi.js")));
hash.update(fs.readFileSync(path.join("js", "phonics.js")));
const version = hash.digest("hex").slice(0, 10);
console.log("cache version " + version);

let html = fs.readFileSync("index.html", "utf8");
html = html
  .replace(/\?v=[^"'\s]+/g, "?v=" + version)
  .replace(/window\.RT_VERSION\s*=\s*"[^"]*"/, 'window.RT_VERSION = "' + version + '"');
fs.writeFileSync(path.join(dest, "index.html"), html);
// 同步工作区入口版本，本地调试与部署一致
fs.writeFileSync("index.html", html);
console.log("copied index.html, app.css, fsi.js, phonics.js (v=" + version + ")");
