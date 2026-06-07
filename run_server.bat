@echo off
title Yomi Kaya Local Web Server
color 05
echo ===================================================
echo   YOMI KAYA Local Web Server (Port 8000)
echo ===================================================
echo.
echo  * Local Address:     http://localhost:8000
echo  * Network Address:   http://192.168.0.184:8000
echo.
echo  * To stop the server, close this window or press Ctrl+C.
echo ===================================================
echo.
python -m http.server 8000
pause
