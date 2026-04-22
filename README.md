# Master for an Hour — Call Control System for Minor Repairs

A university individual project. A web-based repair request management system that connects customers, operators, and masters (workers) through a structured workflow.

## Live Demo

**Visit the deployed application:** [http://master-for-an-hour.vercel.app/](http://master-for-an-hour.vercel.app/)
---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Django + Django REST Framework |
| Database | Supabase (PostgreSQL) |
| Auth | Custom (email + password, role-based) |
| Styling | Inline React styles + global CSS |

---

## User Roles

**Customer**
- Create repair service requests (service type, address, date/time)
- Track the status of their requests in real time
- View history of completed and cancelled repairs
- Receive notifications when request status changes

**Operator (Dispatcher)**
- View all incoming repair requests
- Assign masters to requests based on availability
- Update and manage request statuses
- View statistics and generate reports
- Access full repair history with filters

**Master (Worker)**
- View assigned repair jobs
- Mark jobs as in progress and completed
- Add notes to completed tasks
- Set and update personal availability

---

## Features

- User registration and login with role-based access control
- Repair request creation with service selection, address, and scheduling
- Request lifecycle management: `new → assigned → in_progress → completed / cancelled`
- Master assignment by operator with confirmation
- Task progress updates by master with optional notes
- Full repair history with filters (date range, service, status)
- Statistics dashboard (totals, by service, by status)
- Report generator with filters and summary
- In-app notification system with unread badge and mark as read
- Input validation on both frontend and backend
- Protected routes — each role only sees their own pages

---

## Project Structure

```
master-for-an-hour/
├── backend/                  # Django project
│   ├── manage.py
│   ├── .env                  # DB credentials (not committed)
│   ├── requirements.txt
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── core/                 # Main app
│       ├── models.py
│       ├── views.py
│       ├── urls.py
│       ├── serializers.py
│       └── validators.py
└── frontend/                 # React (Vite) project
    └── src/
        ├── pages/
        ├── components/
        ├── services/
        ├── context/
        └── utils/
```

---

## Database Schema (Supabase / PostgreSQL)

| Table | Description |
|---|---|
| `profiles` | All users (customer, operator, master) |
| `services` | Available repair service types |
| `repair_requests` | Core repair request records |
| `request_updates` | Status change history and notes |
| `master_availability` | Master availability status |
| `notifications` | In-app notifications per user |

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A Supabase project with the schema already created

### 1. Clone the repository

```bash
git clone https://github.com/your-username/master-for-an-hour.git
cd master-for-an-hour
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```
DB_HOST=your-supabase-pooler-host
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.your-project-ref
DB_PASSWORD=your-supabase-password
```

Start the backend:

```bash
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register/` | Register a new user |
| POST | `/api/login/` | Login and get user data |
| GET | `/api/services/` | List all services |
| POST | `/api/requests/create/` | Customer creates a request |
| GET | `/api/requests/` | Get requests (role-filtered) |
| GET | `/api/requests/history/` | Get completed/cancelled requests |
| GET | `/api/requests/master/<id>/` | Get master's assigned jobs |
| PATCH | `/api/requests/<id>/status/` | Update request status |
| PATCH | `/api/requests/<id>/assign/` | Assign master to request |
| PATCH | `/api/requests/<id>/progress/` | Master updates job progress |
| GET | `/api/masters/` | List all masters |
| GET | `/api/availability/` | Get master availability |
| POST | `/api/availability/update/` | Update master availability |
| GET | `/api/stats/` | Get statistics |
| GET | `/api/reports/` | Get filtered report data |
| GET | `/api/notifications/` | Get user notifications |
| PATCH | `/api/notifications/read/<id>/` | Mark notification as read |
| PATCH | `/api/notifications/read-all/` | Mark all notifications as read |

---

## Test Accounts (Seeded Data)

| Role | Email | Password |
|---|---|---|
| Customer | customer@test.com | 1234 |
| Operator | operator@test.com | 1234 |
| Master | master@test.com | 1234 |

> Note: seed these manually in Supabase or via the register form before testing.

---

## Notes

- `.env` is excluded from version control
- Passwords are stored as plain text
- No third-party auth — authentication is handled manually via the `profiles` table
