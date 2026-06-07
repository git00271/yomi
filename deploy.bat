@echo off
chcp 65001 > nul
echo ===================================================
echo  [요미카야 홈페이지 - 깃허브 자동 배포 스크립트]
echo ===================================================
echo.
echo 1. 변경된 파일 수집 중 (git add)...
git add .
echo.
echo 2. 업데이트 메시지 작성 중 (git commit)...
git commit -m "홈페이지 업데이트 (%date% %time%)"
echo.
echo 3. 깃허브 서버로 업로드 중 (git push)...
git push origin main
echo.
echo ===================================================
echo  전송 완료! 10초 내로 Netlify 웹사이트에 자동 반영됩니다.
echo ===================================================
pause
