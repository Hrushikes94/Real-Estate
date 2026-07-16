# Gravity Estates - Premium Luxury Real Estate

An award-winning editorial-style real estate web application curated with contemporary minimalist architecture, coastal penthouses, and modern cliffside retreats.

## Tech Stack

*   **Frontend:** Next.js (App Router, TypeScript), Tailwind CSS v4, Framer Motion for scroll reveals and physics-based spring cursors. Compiled as a **Static HTML Export** for Hostinger compatibility.
*   **Backend:** Modern, lightweight PHP REST API (MySQL, PDO). Native compatibility with Hostinger Shared and Cloud hosting.
*   **Aesthetics:** Poppins font (600/700/800 bold weights) loaded via `next/font`, mix-blend-difference headers, high-contrast layouts, custom canvas-confetti prompts, and visual coordinate mapping plots.

---

## Workspace Structure

```
├── backend/            # PHP Backend API service
│   ├── .htaccess       # Apache rewrite rules for clean REST URLs
│   ├── db.php          # Database helper & manual .env parser
│   ├── seed.php        # Rebuilds tables & inserts default listings
│   ├── properties.php  # Handles /properties & /properties/{id} REST endpoints
│   ├── agents.php      # Handles /agents & /agents/{id} profile requests
│   ├── inquiries.php   # Handles /inquiries viewing submission requests
│   └── router.php      # Router helper for local PHP dev server testing
│
├── frontend/           # Next.js App Router Client app
│   ├── out/            # Static build output ready for Hostinger
│   ├── src/
│   │   ├── app/        # Pages router (Home, About, Contact, Listings, Details)
│   │   ├── components/ # Custom cursor, dynamic preloader, navbar, footer
│   │   └── utils/      # API client wrappers with offline mock dataset fallbacks
│
└── README.md           # This execution manual
```

---

## Local Setup & Run Instructions

### 1. Backend (PHP & MySQL) Local Server
To run the PHP API locally (points to your Hostinger database remotely as whitelisted):
1.  Open a terminal inside the `backend/` folder.
2.  Start the PHP built-in development server with the router script:
    ```bash
    php -S localhost:5000 router.php
    ```

### 2. Frontend (Next.js) Local Server
To run the Next.js development server:
1.  Open a terminal inside the `frontend/` folder.
2.  Run the development script:
    ```bash
    npm run dev
    ```
    *   The frontend will start on [http://localhost:3000](http://localhost:3000).
    *   It will query your local PHP server on port 5000.

---

## Hostinger Production Deployment

### 1. Backend Deployment (PHP)
1.  **Pull Git updates on Hostinger hPanel:**
    *   Go to hPanel -> **Git** -> Click **Deploy** to retrieve the latest PHP repository files.
2.  **Create `.env` file on Hostinger:**
    *   In Hostinger File Manager, go to `public_html/realestate/backend/`.
    *   Create a file named **`.env`** and add your MySQL database connection:
        ```env
        DATABASE_HOST=localhost
        DATABASE_PORT=3306
        DATABASE_USER=your_hostinger_db_username
        DATABASE_PASSWORD=your_hostinger_db_password
        DATABASE_NAME=your_hostinger_db_name
        ```
3.  **Seed the Database:**
    *   In your web browser, visit: `http://yourdomain.com/realestate/backend/seed.php` to drop/recreate tables and insert listings. (Delete `seed.php` after seeding for security).

### 2. Frontend Deployment (Static Next.js)
1.  **Build the static site locally:**
    *   Navigate to the `frontend/` folder and run `npm run build`.
2.  **Upload to Hostinger:**
    *   Open `frontend/out/` on your computer.
    *   Compress all files inside `out/` into a ZIP archive (e.g. `frontend.zip`).
    *   In Hostinger File Manager, navigate to `public_html/`.
    *   Upload `frontend.zip` and extract it directly into `public_html/`.
