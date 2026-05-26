@echo off
echo Setting up ngrok authentication...
echo.
echo FIRST: Get your authtoken from https://ngrok.com/dashboard
echo THEN: Replace YOUR_AUTH_TOKEN below with your actual token
echo.
ngrok authtoken YOUR_AUTH_TOKEN
echo.
echo Starting ngrok for Elsa Fashion App...
ngrok http 3000
pause
