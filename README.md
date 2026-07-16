# Gravity Estates - Premium Luxury Real Estate

An award-winning editorial-style real estate web application curated with contemporary minimalist architecture, coastal penthouses, and modern cliffside retreats.

## Tech Stack

*   **Frontend:** Next.js (App Router, TypeScript), Tailwind CSS v4, Framer Motion for scroll reveals and physics-based spring cursors.
*   **Backend:** NestJS (TypeScript, REST API), TypeORM, PostgreSQL.
*   **Aesthetics:** Poppins font (600/700/800 bold weights) loaded via `next/font`, mix-blend-difference headers, high-contrast layouts, custom canvas-confetti prompts, and visual coordinate mapping plots.

---

## Workspace Structure

```
├── backend/            # NestJS Backend API service
│   ├── src/
│   │   ├── entities/   # TypeORM schema mappings (Agent, Property, User, Inquiry)
│   │   ├── modules/    # API logical blocks (Auth, Users, Agents, Properties, Inquiries)
│   │   ├── seeds/      # Standalone database seeder
│   │   └── main.ts     # Bootstrapper (CORS, Pipes, Swagger OpenAPI)
│   └── .env            # Environment configurations (DB, Secrets)
│
├── frontend/           # Next.js App Router Client app
│   ├── src/
│   │   ├── app/        # Pages router (Home, About, Contact, Listings, Details)
│   │   ├── components/ # Custom cursor, dynamic preloader, navbar, footer
│   │   └── utils/      # API client wrappers with offline mock dataset fallbacks
│
├── docker-compose.yml  # Orchestrates development PostgreSQL instance
└── README.md           # This execution manual
```

---

## Local Setup & Run Instructions

### 1. Database Setup

Ensure you have Docker running locally, and start the PostgreSQL database container from the root directory:

```bash
docker compose up -d
```

*Note: If you do not have Docker installed, you can point the backend to any existing local or cloud PostgreSQL database. Simply update the database connection credentials in `backend/.env`.*

### 2. Backend (NestJS) Run Instructions

Navigate to the `backend/` directory, install packages, run the seed script to populate mock entries, and start the development server:

```bash
cd backend

# Install dependencies
npm install

# Run database seeder (seeds 1 Admin User, 3 Agents, and 5 Luxury Listings)
npm run seed

# Start NestJS development server
npm run start:dev
```

The backend API will start on [http://localhost:5000](http://localhost:5000).
*   **OpenAPI Swagger UI Documentation:** Accessible at [http://localhost:5000/api/docs](http://localhost:5000/api/docs).

### 3. Frontend (Next.js) Run Instructions

Navigate to the `frontend/` directory, install packages, and start the development server:

```bash
cd ../frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

The client application will start on [http://localhost:3000](http://localhost:3000).

---

## Design System Tokens (Tailwind CSS v4)

Tailwind CSS v4 introduces a CSS-first configuration. The design system colors and variables are declared directly inside `frontend/src/app/globals.css` using the `@theme` directive:

*   **Deep Navy (`#0B1F3A`):** Used as primary background and high-contrast typography color.
*   **Earthy Brown (`#8B5E3C`):** Accent brand borders and cursors.
*   **Earthy Tan (`#C9A27E`):** Interaction highlights and scrollbars.
*   **Off-White (`#F7F5F2`):** Background canvas panels.

---

## Offline Catalog Fallback Mode

To ensure the Next.js frontend is fully reviewable and interactive immediately, the API layer (`frontend/src/utils/api.ts`) detects if the NestJS backend/PostgreSQL database is offline. 

If the backend cannot be reached, the frontend automatically falls back to an offline mock dataset, allowing search filters, page detail routing, and schedule forms to function smoothly in mockup mode.
