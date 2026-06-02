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
## Design

### Name and Brand

**Master for an Hour** is a service platform brand designed to convey professionalism, reliability, and quick turnaround for home repair services. The name emphasizes speed and efficiency — customers can book skilled masters ("workers") for minor repairs and have them completed within an hour window. The project uses a premium dark-theme design system to establish a modern, professional appearance suitable for a SaaS-style service platform.

### Structure and Layout

The application is built as a **multi-role dashboard system** rather than a traditional one-page website. The architecture comprises:

- **Landing Page**: Hero section showcasing the service value proposition, features overview, and call-to-action
- **Authentication Pages**: Role-based login and registration
- **Dashboard Pages**: Role-specific interfaces for customers, operators, and masters with protected routing
- **Feature Pages**: Service requests, repair history, availability status, statistics, reports, and reviews

This multi-page approach allows each user role to access only their relevant information, creating a focused and clutter-free experience. Navigation is handled via a persistent navbar with role-aware menu items and a notification bell icon for real-time updates.

### Colour Scheme

The design system employs a **premium dark SaaS palette** with high contrast for accessibility:

**Primary Colors:**
- **Background Primary**: `#111827` (Very dark navy) — Main page background
- **Background Secondary**: `#1F2937` (Dark gray) — Card and component backgrounds
- **Background Tertiary**: `#374151` (Lighter gray) — Hover states and secondary surfaces
- **Accent Primary**: `#22C55E` (Emerald green) — Call-to-action buttons, active states, and highlights
- **Accent Light**: `#86EFAC` (Light green) — Hover effects and secondary accents
- **Accent Dark**: `#16A34A` (Dark green) — Active/pressed states

**Text Colors:**
- **Text Primary**: `#F9FAFB` (Off-white) — Main content text
- **Text Secondary**: `#D1D5DB` (Light gray) — Secondary content and labels
- **Text Tertiary**: `#9CA3AF` (Muted gray) — Disabled text and placeholders

**Rationale**: The dark theme reduces eye strain during extended use (important for operators managing multiple requests), while the emerald accent color suggests growth, reliability, and trust — key values for a service platform. The high contrast between dark backgrounds and light text ensures WCAG AA compliance for accessibility.

### Fonts

Two carefully selected fonts provide hierarchy and convey professionalism:

**Primary Font: Inter**
- Used for all body text, labels, and secondary content
- Modern, highly legible sans-serif with excellent on-screen rendering
- Designed by Rasmus Andersson for geometric clarity at all sizes
- Font sizes range from 12px (captions) to 56px (large headlines)

**Display Font: Outfit**
- Used for headings, navigation, and emphasis
- Geometric sans-serif with a distinctive character suitable for tech-forward branding
- Weights: 600 (semibold) and 700 (bold) for strong visual hierarchy

**Typography Scale:**
- `--text-xs`: 12px
- `--text-sm`: 14px (labels, captions)
- `--text-base`: 16px (body text, default)
- `--text-lg`: 18px (secondary headings)
- `--text-2xl`: 24px (section headings)
- `--text-3xl`: 32px
- `--text-4xl`: 42px (major headings)
- `--text-5xl`: 56px (hero/landing page headlines)

### Navigation and Page Relationships

The application uses **role-based routing** to establish logical connections:

- **Authentication Flow**: Landing → Login/Register → Role-specific Dashboard
- **Customer Journey**: Create Request → Track Status → View History → Leave Review
- **Operator Workflow**: View Requests → Assign Masters → Update Status → View Reports
- **Master Experience**: View Jobs → Update Progress → Mark Complete

All pages link back to the dashboard (sidebar/navbar navigation), and contextual links connect related information (e.g., clicking a service type filters to relevant requests). The notification bell provides quick access to real-time updates across all pages.

### Visual Design Elements

**Spacing and Rhythm:**
- Consistent 8px base unit for spacing (4px, 8px, 12px, 16px, 24px, etc.)
- Contributes to a balanced, organized layout

**Border Radius:**
- Rounded corners create a modern, approachable feel: 8px (buttons), 12px (cards), 16px (modals)
- Softens the technical nature of the platform

**Shadows and Depth:**
- Multi-layered shadow system (`--shadow-sm` through `--shadow-xl`) creates visual depth
- Cards and modals use subtle shadows to separate from background without overwhelming

**Transitions:**
- Smooth animations (150ms–350ms) provide visual feedback for interactions
- Cubic-bezier easing creates professional, polished motion

**Interactions:**
- Green accent color highlights on hover and active states
- Visibility indicator (🟢 online / 🔴 offline) for master availability at a glance
- Input validation with clear visual feedback (focus rings, error messages)

### Imagery and Media

- **Charts**: Recharts library provides professional bar charts (services breakdown) and pie charts (status distribution)
- **Icons**: Notification bell, status indicators, and role badges for quick visual identification
- **Color-Coded Status**: Request lifecycle uses consistent visual markers (pending, assigned, in progress, completed, cancelled)
- **Typography as Visual Element**: Uppercase service names and consistent heading styles create brand consistency

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
