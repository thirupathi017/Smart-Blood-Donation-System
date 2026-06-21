@echo off
echo ===================================================
echo        Starting BloodLink Application
echo ===================================================
echo.

echo [1/3] Starting ML Microservice (FastAPI)...
cd ml_service
start "BloodLink ML Service" cmd /k "echo Starting ML Service... && python app.py"
cd ..

echo [2/3] Starting Backend Server (Spring Boot)...
cd backend
start "BloodLink Backend" cmd /k "echo Building and Starting Backend... && mvn package -DskipTests && java -jar target/blood-link-0.0.1-SNAPSHOT.jar"
cd ..

echo [3/3] Starting Frontend Server (Vite + React)...
cd frontend
start "BloodLink Frontend" cmd /k "echo Starting Frontend... && npm run dev -- --open"
cd ..

echo.
echo ===================================================
echo  Servers are starting in separate command windows!
echo  - ML Service (Port 8000)
echo  - Backend (Port 8080)
echo  - Frontend (Port 5173)
echo.
echo  Your web browser will open automatically once 
echo  the frontend is ready.
echo.
echo  To stop the servers, just close the new windows.
echo ===================================================
pause
