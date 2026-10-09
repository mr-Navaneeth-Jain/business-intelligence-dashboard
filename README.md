# Business Intelligence Dashboard

A full-stack Business Intelligence Dashboard that helps users explore sales performance through summary cards, interactive charts, and searchable sales transactions.

## Features

- Dashboard summary cards for total revenue, units sold, orders, and customers
- Monthly revenue visualization
- Sales revenue breakdown by category
- Search by product or customer
- Filter sales by category, region, and month
- Dynamic charts, KPIs, and transaction table
- Responsive layout

## Technologies Used

**Frontend**
- React.js
- Vite
- Axios
- Chart.js
- React Chart.js 2

**Backend**
- Node.js
- Express.js
- PostgreSQL
- node-postgres (`pg`)

## Project Structure

```text
business-intelligence-dashboard/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   └── salesRoutes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js and npm
- PostgreSQL
- Git

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/mr-Navaneeth-Jain/business-intelligence-dashboard.git
cd business-intelligence-dashboard
```

### 2. Configure PostgreSQL

Create a PostgreSQL database named `businessdashboard`.

Create the `sales` table and insert the sample sales records used by the application.

### 3. Configure the backend

Open the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with your own local database credentials:

```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=businessdashboard
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_PORT=5432
```

Replace `YOUR_POSTGRES_PASSWORD` with your local PostgreSQL password. Never commit this file.

Start the backend:

```bash
node server.js
```

The API should run at `http://localhost:5000`.

### 4. Start the frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /` | API status |
| `GET /api/sales` | Retrieve sales transactions |
| `GET /api/sales/summary` | Retrieve summary metrics |
| `GET /api/sales/monthly` | Retrieve monthly revenue |
| `GET /api/sales/categories` | Retrieve revenue by category |

## Notes

- The dashboard uses sample sales data for demonstration.
- PostgreSQL must be running locally, and the backend database credentials must be configured.
- Environment files and dependency folders should not be uploaded to GitHub.

## Author

**Navaneeth Jain**

GitHub: [mr-Navaneeth-Jain](https://github.com/mr-Navaneeth-Jain)
