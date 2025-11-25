# Industrix Full Stack Todo App

A full-stack Todo List application built with **React (Vite)** and **Go (Gin)**, featuring category management, task prioritization, and responsive design.

## 🚀 Features
* **Todo Management:** Create, Read, Update, Delete (CRUD) tasks.
* **Categories:** Organize tasks by categories (Work, Personal, etc.) with custom colors.
* **Search & Sort:** Search tasks by title and sort by priority, due date, etc.
* **Pagination:** Efficient server-side pagination.
* **Responsive UI:** Optimized for Desktop and Mobile using Ant Design.

---

## 🛠 Tech Stack

### Frontend
* **Framework:** React 19 (Vite)
* **UI Library:** Ant Design (antd v5)
* **State Management:** React Context API
* **HTTP Client:** Axios

### Backend
* **Language:** Go (Golang) 1.23
* **Framework:** Gin Web Framework
* **Database:** PostgreSQL
* **ORM:** GORM
* **Containerization:** Docker & Docker Compose

---

## ⚙️ Setup Instructions

### Option 1: Run with Docker (Recommended)
This is the easiest way to run the entire stack (Database + Backend). Frontend runs locally.

1.  **Start Backend & Database:**
    Open a terminal in the `backend` folder and run:
    ```bash
    cd backend
    docker-compose up --build
    ```
    *The backend API will be available at `http://localhost:8080`.*

2.  **Start Frontend:**
    Open a new terminal in the `frontend` folder and run:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    *Open your browser at `http://localhost:5173` (or the port shown in terminal).*

### Option 2: Run Manually (Local)

**Prerequisites:** PostgreSQL must be installed and running locally.

1.  **Backend Setup:**
    * Ensure PostgreSQL is running.
    * Create a database named `industrix_db`.
    * Navigate to `backend` and create a `.env` file (or update environment variables in your terminal) to match your local DB credentials:
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
    * Same as Option 1 (Step 2).

---

## VX API Documentation

### Todos
| Method | Endpoint | Description | Query Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/todos` | Get paginated list of todos | `page`, `limit`, `search`, `sort_by`, `order` |
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

## 📝 Technical Decisions & Answers

### 1. Database Design
**Structure:**
I created two main tables: `todos` and `categories`.
* **`categories`**: Stores `id`, `name`, and `color`.
* **`todos`**: Stores task details (`title`, `priority`, `due_date`, etc.) and has a Foreign Key `category_id` linking to the `categories` table.

**Reasoning:**
* **Normalization:** Separating categories into their own table avoids data redundancy. If we want to change a category's color, we only update it in one place.
* **Indexing:** An index was added to the `todos(title)` column to optimize search performance, as searching by title is a core feature.
* **Constraints:** The `priority` column uses a check constraint (handled via validation in Go) to ensure values are strictly 'high', 'medium', or 'low'.

### 2. Pagination & Filtering
**Implementation:**
Pagination and filtering are handled on the **Backend (Server-side)** to ensure performance and scalability with large datasets.

* **Query Logic:**
    * **Pagination:** Uses SQL `LIMIT` and `OFFSET` calculated from the `page` and `limit` query parameters.
    * **Filtering (Search):** Uses a `WHERE title ILIKE %search%` clause for case-insensitive partial matching.
    * **Sorting:** Dynamic `ORDER BY` clauses based on user selection (e.g., sorting Priority High->Low uses a custom `CASE WHEN` SQL statement).
* **Why Server-side?** Fetching all data to the frontend just to filter/sort page 1 is inefficient. Server-side processing reduces payload size and memory usage on the client.

### 3. Technical Decisions (Architecture)
* **Backend (Go + Gin):** Chosen for its high performance and simplicity. The architecture follows a layered approach:
    * `models/`: Defines data structures and DB schema.
    * `controllers/`: Handles HTTP request logic.
    * `config/`: Manages Database connections.
    * `routes/`: Maps endpoints to controllers.
* **Frontend (React + Context API):**
    * **Context API:** Used `TodoContext` to manage global state (todos list, loading status, pagination) effectively without "prop drilling".
    * **Ant Design:** Chosen to speed up UI development with professional, accessible, and responsive components (Table, Modal, Forms).

### 4. Responsive Design
**Implementation:**
* **Grid System:** Used Ant Design's `<Row>` and `<Col>` components to create layouts that adapt to screen width.
* **Adaptive Tables:** The Todo List table conditionally hides less critical columns (like "Category" or "Due Date") on mobile screens (`xs`) using the `responsive` prop, ensuring the layout remains clean on small devices.
