# Smart Blood Donation System (BloodLink)

BloodLink is an AI-powered blood donor management platform that intelligently connects blood donors with patients and hospitals in need. The system uses a modern microservices architecture to provide a seamless, secure, and smart experience for all users, facilitating faster response times during emergencies.

## 🌟 Key Features

- **AI-Powered Matching**: Intelligently matches donors to urgent requests based on location (latitude/longitude), blood group compatibility, and availability using our Python ML service.
- **Real-Time Dashboard**: Interactive dashboards for admins and hospitals to track inventory, active requests, and recent donations.
- **Role-Based Access**: Dedicated interfaces and functionalities for:
  - **Donors**: Track donation history, view eligible dates, and respond to requests.
  - **Hospitals**: Broadcast urgent blood requests and search for nearby eligible donors.
  - **Administrators**: Oversee the entire platform, manage users, and monitor system metrics.
- **Real-Time Notifications**: Uses WebSockets to alert donors immediately when there is an urgent need for their blood type in their vicinity.

## 🚀 Tech Stack

### Frontend
- **React 18** (powered by Vite for fast builds)
- **Tailwind CSS** for a responsive, modern UI
- **Zustand** for lightweight global state management
- **React Router** for seamless navigation
- **STOMP.js & SockJS** for real-time WebSocket communication

### Backend
- **Java 17 & Spring Boot**
- **Spring Data JPA & Hibernate** for ORM
- **Maven** for dependency management and build
- **MySQL** as the primary relational database for persistent storage

### ML Microservice
- **Python 3.8+**
- **FastAPI** for a high-performance REST API to serve predictions
- **Scikit-Learn, Pandas, NumPy** for machine learning models and data processing

## 📂 Project Structure

```text
BloodLink/
├── backend/            # Spring Boot application (REST API & Business Logic)
├── frontend/           # React frontend application
├── ml_service/         # Python FastAPI service for AI donor matching
├── databases/          # Database schemas, scripts, and exports
├── start_bloodlink.bat # Helper script to launch all 3 services on Windows
└── README.md           # Project documentation
```

## 🛠️ Getting Started

### Prerequisites
Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Java Development Kit (JDK)](https://adoptium.net/) (v17 or higher)
- [Python](https://www.python.org/) (v3.8 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)

### 🚀 Running the Application Locally

#### The Quick Way (Windows Only)
For Windows users, you can use the provided batch script to start the frontend, backend, and ML services simultaneously:
```bat
start_bloodlink.bat
```
This script will open three separate command windows for each service.

#### The Manual Way (All Platforms)

If you prefer to start the services individually, follow these steps:

**1. Database Setup**
- Ensure your MySQL server is running.
- Create a database for BloodLink (check `backend/src/main/resources/application.properties` for the exact database name and credentials).

**2. Start the Backend (Spring Boot)**
```bash
cd backend
./mvnw spring-boot:run
```
*The backend usually runs on `http://localhost:8080`.*

**3. Start the Frontend (React)**
```bash
cd frontend
npm install
npm run dev
```
*The frontend usually runs on `http://localhost:5173`.*

**4. Start the ML Service (Python)**
```bash
cd ml_service
pip install -r requirements.txt
python app.py
# or uvicorn app:app --reload
```
*The ML service usually runs on `http://localhost:8000`.*

## 📄 License
This project is licensed under the MIT License.
