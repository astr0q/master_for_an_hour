# Master for an Hour — Call Control System for Minor Repairs

A university individual project. A web-based repair request management system that connects customers, operators, and masters (workers) through a structured workflow.

---

## Live Demo

**Visit the deployed application:** [http://master-for-an-hour.vercel.app/](http://master-for-an-hour.vercel.app/)

### Current Limitations

#### Desktop Registration & Permissions

When registering a new account via a desktop browser, a permission pop-up will appear after clicking the **Register** button.

- **Action Required:** You must select **Allow** for the registration to complete successfully.
- **Outcome of Denial:** If permissions are denied, the registration process will fail and the account will not be created.

#### Mobile Access

Currently, registration is **not supported** on mobile devices. Users attempting to sign up via a smartphone will receive a "Registration failed" error message.

#### Technical Root Cause & Future Fix

These limitations stem from known backend connectivity issues between **Django** and **Vercel's** serverless infrastructure. To resolve these, it is recommended to migrate the backend to a dedicated hosting provider such as **AWS**, **DigitalOcean**, or **Railway** that supports persistent connections.

---

## Tech Stack

| Layer    | Technology                            |
| -------- | ------------------------------------- |
| Frontend | React (Vite)                          |
| Backend  | Django + Django REST Framework        |
| Database | Supabase (PostgreSQL)                 |
| Auth     | Custom (email + password, role-based) |
| Charts   | Recharts                              |
| Styling  | Inline React styles + global CSS      |

---

## User Roles

**Customer**

- Create repair service requests (service type, address, date/time)
- Track the status of their requests in real time
- View history of completed and cancelled repairs
- Leave star ratings and comments on completed jobs
- Receive notifications when request status changes

**Operator (Dispatcher)**

- View all incoming repair requests
- Assign masters to requests based on availability (with live availability indicator)
- Update and manage request statuses
- View statistics dashboard with charts
- Generate and export reports as CSV
- Access full repair history with filters

**Master (Worker)**

- View assigned repair jobs
- Mark jobs as in progress and completed
- Add notes to completed tasks
- Set and update personal availability status

---

## Features

- User registration and login with role-based access control
- Repair request creation with service selection, address, and scheduling
- Request lifecycle management: `new → assigned → in_progress → completed / cancelled`
- Master assignment by operator with availability indicator (🟢 / 🔴) in dropdown
- Task progress updates by master with optional notes
- Customer review and star rating system for completed jobs
- Full repair history with filters (date range, service, status)
- Statistics dashboard with bar chart (by service) and pie chart (by status)
- Report generator with filters, summary, and CSV export
- In-app notification system with unread badge and mark as read
- Input validation on both frontend and backend
- Protected routes — each role only sees their own pages
- Dark mode toggle with preference saved to localStorage
- Footer with contact info, services list, and embedded Google Maps location

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

| Table                 | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `profiles`            | All users (customer, operator, master)                |
| `services`            | Available repair service types (15 services)          |
| `repair_requests`     | Core repair request records                           |
| `request_updates`     | Status change history and notes                       |
| `master_availability` | Master availability status                            |
| `notifications`       | In-app notifications per user                         |
| `reviews`             | Customer star ratings and comments for completed jobs |

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A Supabase project with the schema already created
- An OpenRouter API key (free at https://openrouter.

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

Create a `.env` file inside `frontend/`:

> Both servers must be running simultaneously for the application to work.

---

## API Endpoints

| Method | Endpoint                        | Description                        |
| ------ | ------------------------------- | ---------------------------------- |
| POST   | `/api/register/`                | Register a new user                |
| POST   | `/api/login/`                   | Login and get user data            |
| GET    | `/api/services/`                | List all services                  |
| POST   | `/api/requests/create/`         | Customer creates a request         |
| GET    | `/api/requests/`                | Get requests (role-filtered)       |
| GET    | `/api/requests/history/`        | Get completed/cancelled requests   |
| GET    | `/api/requests/master/<id>/`    | Get master's assigned jobs         |
| PATCH  | `/api/requests/<id>/status/`    | Update request status              |
| PATCH  | `/api/requests/<id>/assign/`    | Assign master to request           |
| PATCH  | `/api/requests/<id>/progress/`  | Master updates job progress        |
| GET    | `/api/masters/`                 | List all masters with availability |
| GET    | `/api/availability/`            | Get master availability            |
| POST   | `/api/availability/update/`     | Update master availability         |
| GET    | `/api/stats/`                   | Get statistics and chart data      |
| GET    | `/api/reports/`                 | Get filtered report data           |
| GET    | `/api/notifications/`           | Get user notifications             |
| PATCH  | `/api/notifications/read/<id>/` | Mark notification as read          |
| PATCH  | `/api/notifications/read-all/`  | Mark all notifications as read     |
| POST   | `/api/reviews/submit/`          | Submit a star rating and comment   |
| GET    | `/api/reviews/`                 | Get reviews (filterable by master) |

---

## Available Services

The system includes 15 real-world repair and home services:

| #   | Service               | Base Price |
| --- | --------------------- | ---------- |
| 1   | Plumbing              | €50        |
| 2   | Electrical Work       | €70        |
| 3   | Furniture Repair      | €40        |
| 4   | Painting & Decorating | €60        |
| 5   | Appliance Repair      | €80        |
| 6   | Locksmith             | €55        |
| 7   | Carpentry             | €65        |
| 8   | Cleaning              | €45        |
| 9   | Tiling                | €75        |
| 10  | Boiler Service        | €90        |
| 11  | Roof Repair           | €100       |
| 12  | Window Repair         | €60        |
| 13  | Floor Installation    | €85        |
| 14  | Garden & Landscaping  | €50        |
| 15  | Pest Control          | €70        |

---

## Test Accounts (Seeded Data)

| Role     | Email             | Password |
| -------- | ----------------- | -------- |
| Customer | customer@test.com | 1234     |
| Operator | operator@test.com | 1234     |
| Master   | master@test.com   | 1234     |

> Seed these manually in Supabase or via the register form before testing.

---

## Notes

- `.env` files are excluded from version control — never commit them
- Passwords are stored as plain text (acceptable for university project scope — in production, bcrypt hashing would be used)
- No third-party auth — authentication is handled manually via the `profiles` table
- RLS (Row Level Security) is not enabled — the project is not intended for public production deployment
- The AI chatbot uses the free tier of OpenRouter and requires an internet connection+
