@echo off
chcp 65001 >nul 2>&1
title AI Nav - Auto Start
echo [%date% %time%] AI Tools Nav starting...

cd /d "C:\Users\83718\.qclaw\workspace\ai-navigation\server"
start """ /min node server.js
echo [%date% %time%] Node.js backend started
timeout /t 3 /nobreak >nul

start """ /min "C:\Program Files\cpolar\cpolar.exe" http 3000
echo [%date% %time%] Cpolar tunnel started

echo [%date% %time%] Waiting for tunnel...

:wait_loop
timeout /t 2 /nobreak >nul
for /f "delims=" %%a in ('powershell -NoProfile -Command "try{  = Invoke-RestMethod http://127.0.0.1:4042/api/v1/tunnels -TimeoutSec 5; .data.tunnels | Where-Object {.public_url -match 'https'} | Select-Object -First 1 -ExpandProperty public_url }catch{ '' }" 2^>nul') do set URL=%%a

if "%URL%"==""" goto wait_loop

echo %URL% > "C:\Users\83718\.qclaw\workspace\ai-navigation\server\data\current_url.txt"
echo [%date% %time%] URL: %URL%
echo [%date% %time%] %URL% >> "C:\Users\83718\.qclaw\workspace\ai-navigation\server\data\startup.log"

powershell -NoProfile -Command "[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] > $null; $template = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02); $textNodes = $template.GetElementsByTagName('text'); $textNodes.Item(0).AppendChild($template.CreateTextNode('AI Tools Nav Started')) > $null; $textNodes.Item(1).AppendChild($template.CreateTextNode('URL: %URL%')) > $null; $toast = [Windows.UI.Notifications.ToastNotification]::new($template); [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('AI Tools Nav').Show($toast)"

exit
