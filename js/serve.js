const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
// 核心包：界面与课程。词库按等级拆成 lexpack-a1/a2/b1/b2.js 按需下载，课文 fsi.js 与音标 phonics.js 打开对应页面时才下。
const bundle = [
  "content.js", "speech.js", "store.js", "account.js",
  "course.js", "course-more.js", "course-cover.js", "study.js"
];
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml"
};

const server = http.createServer(function (req, res) {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  const rel = url === "/" ? "index.html" : url.replace(/^\/+/, "");
  if (rel === "js/rianthai.js") {
    const parts = bundle.map(function (name) {
      return fs.readFileSync(path.join(root, "js", name), "utf8");
    });
    res.writeHead(200, {
      "Content-Type": types[".js"],
      "Cache-Control": "no-cache"
    });
    res.end(parts.join("\n"));
    return;
  }
  const file = path.normalize(path.join(root, rel));
  if (!file.startsWith(root)) {
    res.writeHead(403);
    res.end("forbidden");
    return;
  }
  fs.readFile(file, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-cache"
    });
    res.end(data);
  });
});

server.listen(8765, "127.0.0.1", function () {
  console.log("http://127.0.0.1:8765");
});
