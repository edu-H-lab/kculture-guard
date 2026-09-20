@echo off
chcp 65001 >nul
title 우리 문화 수호대 (AI 포함) - 이 창을 닫으면 프로그램이 멈춰요
set "SERVER=%~dp0..\source\server"

where node >nul 2>nul
if errorlevel 1 goto NONODE
if not exist "%SERVER%\server.js" goto NOSERVER
if not exist "%SERVER%\.env" goto NOENV
goto RUN

:NOENV
echo.
echo  [안내] source\server\.env 파일이 없어요.
echo  지금은 생각친구가 정해진 질문으로만 동작하고,
echo  교사용 AI 분석 버튼은 쓸 수 없어요.
echo.
echo  AI를 쓰려면(최초 1회만 설정):
echo    1. source\server\.env.example 을 복사해 .env 로 이름을 바꾸세요.
echo    2. .env 를 열어 GEMINI_API_KEY 와
echo       THINKING_FRIEND_PROVIDER=gemini 를 채우세요.
echo    3. 이 파일을 다시 실행하세요.
echo  자세한 방법: program\AI_실행_안내.txt
echo.
goto RUN

:RUN
cd /d "%SERVER%"
echo.
echo  AI 서버를 켜는 중이에요... 잠시 뒤 브라우저가 열려요.
echo  (생각친구 · 교사용 AI 분석 사용 가능)
echo  이 창을 닫으면 프로그램이 멈춰요.
echo.
start "" /min cmd /c "timeout /t 3 >nul & start http://localhost:8780"
node server.js
pause
exit /b

:NONODE
echo.
echo  Node.js 가 설치되어 있지 않아 AI 없이 실행할게요.
echo  AI 기능을 쓰려면 https://nodejs.org 에서 Node.js(LTS) 를 설치한 뒤
echo  이 파일을 다시 실행하세요. (자세한 방법: AI_실행_안내.txt)
echo.
timeout /t 5 >nul
call "%~dp01_실행하기.bat"
exit /b

:NOSERVER
echo.
echo  AI 서버 폴더 source\server 를 찾지 못해 AI 없이 실행할게요.
echo.
timeout /t 5 >nul
call "%~dp01_실행하기.bat"
exit /b
