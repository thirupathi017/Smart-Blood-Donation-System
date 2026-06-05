@echo off
echo ===================================================
echo        Starting BloodLink Application
echo ===================================================
echo.

echo [1/2] Starting Backend Server (Spring Boot)...
cd backend
start "BloodLink Backend" cmd /k "echo Building and Starting Backend... && mvn package -DskipTests && java -jar target/blood-link-0.0.1-SNAPSHOT.jar"
cd ..

echo [2/2] Starting Frontend Server (Vite + React)...
cd frontend
start "BloodLink Frontend" cmd /k "echo Starting Frontend... && npm run dev -- --open"
cd ..

echo.
echo ===================================================
echo  Servers are starting in separate command windows!
echo  Your web browser will open automatically once 
echo  the frontend is ready.
echo.
echo  To stop the servers, just close the new windows.
echo ===================================================
pause
