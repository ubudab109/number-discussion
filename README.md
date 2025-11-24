# Number Discussion Application

A fullstack application where users communicate through numbers and mathematical operations, creating tree-like discussion structures.

## Technology Stack

-   **Backend**: Node.js + Express + TypeScript + PostgreSQL
-   **Frontend**: React + TypeScript + Vite + Tailwind CSS v4
-   **Database**: PostgreSQL
-   **Testing**: Jest (backend unit tests)
-   **Containerization**: Docker + Docker Compose

## Features

-   User authentication (registration and login with JWT)
-   Create starting numbers to begin discussions
-   Add mathematical operations (add, subtract, multiply, divide) to any number
-   View all discussions as tree structures
-   Real-time calculation of results
-   Responsive UI with Tailwind CSS v4

## Business Scenarios Covered

1. ✅ Unregistered users can view the tree of all user posts
2. ✅ Unregistered users can create an account
3. ✅ Unregistered users can authenticate and become registered users
4. ✅ Registered users can start a chain of calculations by publishing a starting number
5. ✅ Registered users can add operations on selected starting numbers
6. ✅ Registered users can respond to any calculations by publishing new ones

## Quick Start

### Prerequisites

-   Docker and Docker Compose installed
-   Ports 80, 3000, and 5432 available

### Running with Docker Compose

1. Clone the repository and navigate to the fullstack directory:

```bash
cd fullstack
```

2. Copy the environment file (optional):

```bash
cp .env.example .env
```

3. Start all services:

-   Need to install make command on your environment to install easily

```bash
make start
```

-   If don't have make command, you can use this command

```bash
cd backend && npm install
cd frontend && npm install
docker-compose up --build
```

4. Access the application:

-   Frontend: http://localhost
-   Backend API: http://localhost:3000
-   Database: localhost:5432

### Stopping the Application

```bash
docker-compose down
```

or

```bash
make stop
```

To remove volumes as well:

```bash
make clean
```

or

```bash
docker-compose down -v
```

## Development

### Backend Development

```bash
cd backend
npm install
npm run dev
```

Run tests:

```bash
npm test
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## API Documentation

### Authentication Endpoints

#### Register

-   **POST** `/api/auth/register`
-   Body: `{ "username": "string", "password": "string" }`
-   Response: `{ "token": "string", "userId": number }`

#### Login

-   **POST** `/api/auth/login`
-   Body: `{ "username": "string", "password": "string" }`
-   Response: `{ "token": "string", "userId": number }`

### Calculation Endpoints

#### Get All Calculations

-   **GET** `/api/calculations`
-   Response: Array of calculation trees

#### Create Starting Number

-   **POST** `/api/calculations`
-   Headers: `Authorization: Bearer <token>`
-   Body: `{ "startingNumber": number }`
-   Response: Calculation object

#### Add Operation

-   **POST** `/api/calculations`
-   Headers: `Authorization: Bearer <token>`
-   Body: `{ "parentId": number, "operation": "add"|"subtract"|"multiply"|"divide", "operand": number }`
-   Response: Calculation object

## Database Schema

### Users Table

-   `id`: Serial Primary Key
-   `username`: Unique VARCHAR(255)
-   `password_hash`: VARCHAR(255)
-   `created_at`: Timestamp

### Calculations Table

-   `id`: Serial Primary Key
-   `user_id`: Foreign Key to users
-   `parent_id`: Self-referential Foreign Key (nullable)
-   `starting_number`: Decimal (nullable)
-   `operation`: VARCHAR(20) (nullable)
-   `operand`: Decimal (nullable)
-   `result`: Decimal
-   `created_at`: Timestamp

## Project Structure

```
fullstack/
├── backend/
│   ├── src/
│   │   ├── __tests__/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## License

ISC
