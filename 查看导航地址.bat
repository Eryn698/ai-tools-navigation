@echo off
chcp 65001 >nul 2>&1
echo ============================================
echo    AI工具导航 - 当前公网地址
echo ============================================
echo.

:: 检查服务是否运行
tasklist /fi "imagename eq node.exe" 2>nul | find /i "node" >nul 2>&1
if errorlevel 1 (
    echo [!] Node服务未运行，正在启动...
    cd /d "C:\Users\83718\.qclaw\workspace\ai-navigation\server"
    start "" /min node server.js
    timeout /t 3 /nobreak >nul
)

tasklist /fi "imagename eq cpolar.exe" 2>nul | find /i "cpolar" >nul 2>&1
if errorlevel 1 (
    echo [!] cpolar未运行，正在启动...
    start "" /min "C:\Program Files\cpolar\cpolar.exe" http 3000
    echo [!] 等待隧道建立（约10秒）...
    timeout /t 10 /nobreak >nul
)

:: 尝试从文件读取
if exist "C:\Users\83718\.qclaw\workspace\ai-navigation\server\data\current_url.txt" (
    set /p SAVED=<"C:\Users\83718\.qclaw\workspace\ai-navigation\server\data\current_url.txt"
    echo [保存的地址] %SAVED%
    echo.
)

:: 从cpolar API实时获取
echo [实时获取中...]
powershell -NoProfile -Command "try{ $r = Invoke-RestMethod http://127.0.0.1:4042/api/v1/tunnels -TimeoutSec 5; $t = $r.data.tunnels | Where-Object {$_.public_url -match 'https'} | Select-Object -First 1; if($t){ Write-Host ''; Write-Host '============================================'; Write-Host '  前台地址: ' $t.public_url; Write-Host '  管理后台: ' $t.public_url '/admin'; Write-Host '  后台密码: admin123 (登录后请修改)'; Write-Host '============================================'; Write-Host ''; Write-Host '正在打开浏览器...'; Start-Process $t.public_url }else{ Write-Host '[!] 未找到隧道，请稍后重试' } }catch{ Write-Host '[!] 无法连接cpolar，请确认服务正在运行' }"

echo.
pause
