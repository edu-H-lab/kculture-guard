@echo off
chcp 65001 >nul
title 우리 문화 수호대 (AI 없이) - 이 창을 닫으면 프로그램이 멈춰요
cd /d "%~dp0"
echo.
echo  우리 문화 수호대를 여는 중이에요... (AI 없이 실행)
echo  생각친구·교사용 AI 분석까지 쓰려면 2_AI포함_실행하기.bat 을 이용하세요.
echo  (자세한 방법: AI_실행_안내.txt)
echo  브라우저가 열리면 그대로 사용하세요.
echo  이 창을 닫으면 프로그램이 멈춰요.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-local.ps1" -Port 8756
pause
