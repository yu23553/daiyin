@echo off
cd /d "%~dp0"
echo.
echo  在浏览器打开  http://localhost:8765
echo  关掉这个窗口，网站就停了。
echo.
where node >nul 2>nul && (
  node js\serve.js
  goto :eof
)
where py >nul 2>nul && (
  py -m http.server 8765
  goto :eof
)
python -m http.server 8765
