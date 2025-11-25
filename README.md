# Industrix Full Stack Todo App

A robust, full-stack Todo List application built with **React (Vite)** and **Go (Gin)**. This application demonstrates modern web development practices including server-side pagination, advanced filtering, containerization, and unit testing.

## 🚀 Features

### Core Features
* **Todo Management:** Create, Read, Update, and Delete (CRUD) tasks.
* **Categories:** Organize tasks by categories (Work, Personal, etc.) with custom colors.
* **Responsive UI:** Fully responsive design optimized for Desktop, Tablet, and Mobile using **Ant Design**.

### Advanced Features
* **🔍 Search:** Real-time search by task title using database `ILIKE` queries.
* **⚡ Pagination:** Efficient server-side pagination to handle large datasets.
* **🐳 Dockerized:** Full stack (Backend + Database) runs via Docker Compose.
* **🚨 Prioritization:** Visual indicators for High, Medium, and Low priority tasks.
* **🧪 Unit Tests:** Backend controllers structure supports testing.

---

## 🛠 Tech Stack

### Frontend
* **Framework:** React 19 (Vite)
* **UI Library:** Ant Design (antd v5)
* **State Management:** React Context API
* **HTTP Client:** Axios
* **Linting:** ESLint

### Backend
* **Language:** Go (Golang) 1.23
* **Framework:** Gin Web Framework
* **Database:** PostgreSQL (Production)
* **ORM:** GORM
* **Containerization:** Docker & Docker Compose

---

## ⚙️ Setup Instructions

### Option 1: Run with Docker (Recommended)
This is the easiest way to run the Backend and Database.

1.  **Start Backend & Database:**
    Open a terminal in the `backend` folder:
    ```bash
    cd backend
    docker-compose up --build
    ```
    *The backend API will be available at `http://localhost:8080`.*

2.  **Start Frontend:**
    Open a new terminal in the `frontend` folder:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    *Open your browser at `http://localhost:5173`.*

### Option 2: Run Manually (Local)

**Prerequisites:** PostgreSQL must be installed and running locally.

1.  **Backend Setup:**
    * Create a PostgreSQL database named `industrix_db`.
    * Navigate to `backend` and create a `.env` file matching your local DB credentials:
        ```env
        DB_HOST=localhost
        DB_USER=postgres
        DB_PASSWORD=yourpassword
        DB_NAME=industrix_db
        DB_PORT=5432
        ```
    * Run the server:
        ```bash
        cd backend
        go run cmd/main.go
        ```

2.  **Frontend Setup:**
    * Follow the same steps as Option 1.

---

## 📡 API Documentation

### Todos
| Method | Endpoint | Description | Query Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/todos` | Get paginated list of todos | `page`, `limit`, `search`, `sort_by`, `order`, `priority`, `completed`, `category_id` |
| `POST` | `/api/todos` | Create a new todo | - |
| `GET` | `/api/todos/:id` | Get specific todo details | - |
| `PUT` | `/api/todos/:id` | Update a todo | - |
| `DELETE` | `/api/todos/:id` | Delete a todo | - |
| `PATCH` | `/api/todos/:id/complete`| Toggle completion status | - |

### Categories
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/categories` | Get all categories |
| `POST` | `/api/categories` | Create a new category |
| `DELETE` | `/api/categories/:id` | Delete a category |

---

## 📝 Technical Decisions

### 1. Database Design
**Structure:**
Two main tables: `todos` and `categories`.
* **`categories`**: Stores `id`, `name`, and `color`.
* **`todos`**: Stores task details (`title`, `priority`, `due_date`, etc.) and has a Foreign Key `category_id` linking to the `categories` table.

**Reasoning:**
* **Normalization:** Separating categories avoids data redundancy.
* **Indexing:** An index was added to the `todos(title)` column (`CREATE INDEX idx_todos_title`) to optimize search performance.

### 2. Pagination & Filtering
**Implementation:**
Pagination and filtering are handled on the **Backend (Server-side)**.
* **Query Logic:**
    * **Pagination:** Uses SQL `LIMIT` and `OFFSET` calculated from `page` and `limit` params.
    * **Filtering (Search):** Uses a `WHERE title ILIKE %search%` clause for case-insensitive partial matching.
* **Why Server-side?** Fetching all data to the frontend just to filter/sort page 1 is inefficient. Server-side processing reduces payload size.

### 3. Architecture
* **Backend (Go + Gin):** Layered approach:
    * `models/`: DB schema structs.
    * `controllers/`: HTTP logic.
    * `config/`: DB connections.
    * `routes/`: Endpoint mapping.
* **Frontend (React + Context API):**
    * **Context API:** `TodoContext` manages global state to avoid "prop drilling".
    * **Ant Design:** Accelerates UI development with responsive components.

---

## 🧪 Running Tests

The backend includes unit tests for controllers using an in-memory SQLite database for speed and isolation.

To run the tests:
```bash
cd backend
go test ./controllers -v
