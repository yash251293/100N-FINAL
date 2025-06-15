# Project Analysis

## 1. Overall Project Overview

*   **Project Purpose:** The project appears to be a professional networking platform, potentially called "100 Networks." It aims to connect individuals and companies, facilitating job searches, collaborations, and professional growth. Users can register as individuals or companies, create profiles, browse job listings, and apply for positions.
*   **Main Parts:**
    *   **`Final UI`**: The primary frontend application.
    *   **`backend`**: The backend service providing API and database interactions.
    *   **`Login Signup Landing`**: A secondary frontend directory, likely an earlier version, prototype, or a feature-specific build focusing on the landing and initial signup flow.

## 2. 'Final UI' (Frontend Analysis)

*   **Technology Stack:**
    *   Framework: Next.js (v15.2.4, likely using App Router)
    *   Language: TypeScript (v5)
    *   UI Library: React (v19)
    *   Styling: Tailwind CSS (v3.4.17)
    *   Component Library: Shadcn/ui (inferred from `components.json`, Radix UI usage, and component structure)
    *   Icons: Lucide React
*   **Key Features (Inferred from Page Structures & Components):**
    *   User Authentication (Login, Signup, Protected Routes).
    *   User Profile Management (viewing and editing personal details, experience, education, skills, resume upload for individuals).
    *   Company Profile Management (viewing and editing company details).
    *   Job Listings & Search (browsing jobs, detailed job views, applying for jobs).
    *   User Type Selection (Individual vs. Company).
    *   Landing Page with marketing content.
    *   Potentially messaging (implied by "Connect, Collaborate" themes, but no specific messaging UI was analyzed).
*   **Structure:**
    *   Utilizes Next.js App Router (`app` directory).
    *   Mix of Server Components (e.g., `app/profile/page.tsx` implicitly) and Client Components (e.g., `app/layout.tsx`, `app/page.tsx`, `app/jobs/page.tsx`).
    *   Global layout defined in `app/layout.tsx`.
    *   Reusable UI components likely organized within a `components` directory, with Shadcn/ui components in `components/ui`.
*   **State Management:**
    *   React Context API: Used for global authentication state (`AuthContext` in `context/AuthContext.tsx`).
    *   Local Component State: React `useState` hook for managing UI state within components (e.g., modals, form inputs, filters).
*   **Styling:**
    *   Tailwind CSS is the primary styling engine, configured in `tailwind.config.ts`.
    *   Shadcn/ui components provide pre-styled, customizable UI primitives built with Tailwind CSS and Radix UI.
    *   Global styles and CSS variables defined in `app/globals.css`.
    *   Supports dark mode (`darkMode: "class"`).
*   **Firebase Integration:**
    *   The `firebase` dependency is present in `package.json`.
    *   `lib/firebase.ts` initializes Firebase, specifically `firebase/auth`.
    *   While `AuthContext.tsx` manages a custom JWT (`authToken`) for session management with the custom backend, Firebase is likely used for the initial authentication step (e.g., user creation, social logins, or initial token generation before exchanging for the custom JWT).
*   **Build Configuration (`next.config.mjs`):**
    *   ESLint and TypeScript errors are set to be ignored during builds (`ignoreDuringBuilds: true`, `ignoreBuildErrors: true`), which could mask issues in production.
    *   Next.js image optimization is disabled (`images: { unoptimized: true }`).

## 3. 'Backend' (Backend Analysis)

*   **Technology Stack:**
    *   Runtime: Node.js
    *   Framework: Express.js (v4.17.1)
    *   Language: JavaScript (ES modules are not used, `require` syntax is prevalent)
    *   Database: PostgreSQL (using `pg` library v8.7.1)
*   **API Structure:**
    *   RESTful API design.
    *   Routes are modularized:
        *   `authRoutes.js` (mounted under `/api/auth`): Handles registration, login, marking users as verified.
        *   `userRoutes.js` (mounted under `/api/users`): Handles user profile fetching, updates (profile, preferences, culture), and resume uploads.
    *   Main server setup in `index.js`, including middleware and port configuration.
*   **Authentication:**
    *   JWT-based authentication.
    *   `jsonwebtoken` library is used for creating and verifying tokens.
    *   Passwords are hashed using `bcryptjs`.
    *   `authMiddleware.js` protects routes by verifying the `Bearer` token in the `Authorization` header and attaching user data to `req.user`.
*   **Database:**
    *   PostgreSQL is the database system.
    *   Database connection is managed by `pg.Pool` in `db/index.js`, configured via environment variables.
    *   Schema is defined and versioned using raw SQL migration files:
        *   `001_create_users_table.sql`: Defines the `users` table with core user information (email, password_hash, user_type, etc.). Enforces email uniqueness (case-insensitively via a lowercased index).
        *   `002_create_user_profiles_table.sql`: Defines the `user_profiles` table with a one-to-one relationship to `users`, storing extended profile details. Utilizes `ON DELETE CASCADE`.
    *   Triggers are used to automatically update `updated_at` timestamps in both tables.
*   **File Uploads:**
    *   Uses `multer` middleware to handle `multipart/form-data`.
    *   Specifically configured for resume uploads in `userRoutes.js`, including file type validation, size limits, and custom filename generation to associate uploads with user IDs.
    *   Files are stored in the `backend/uploads/resumes/` directory.

## 4. 'Login Signup Landing' (Analysis)

*   **Purpose:** This directory appears to be an **earlier version, a prototype, or a feature-specific development build** focused exclusively on the landing page and the initial user type selection leading to a signup flow.
*   **Technology Stack:**
    *   Nearly identical to `Final UI`: Next.js (v15.2.4), React (v19), TypeScript (v5), Tailwind CSS (v3.4.17), Shadcn UI (inferred).
*   **Key Differences/Similarities to 'Final UI':**
    *   **Similarities:**
        *   `package.json` is almost identical, indicating the same core dependencies and development tools.
        *   The `app/page.tsx` (landing page) is structurally and visually almost a line-by-line match to the one in `Final UI`.
    *   **Differences:**
        *   **Dependencies:** `firebase` dependency is absent. Minor version differences in `date-fns` and a couple of `@radix-ui` packages.
        *   **Routing:** The signup navigation path in `app/page.tsx` is `router.push(\`/signup?type=${type}\`)`, whereas in `Final UI` it's `router.push(\`/auth/signup?type=${type}\`)`. This suggests `Final UI` has a more organized routing structure for auth-related pages.
        *   **Scope:** `Login Signup Landing` seems to contain only the landing page and necessary components for it, while `Final UI` is a more comprehensive application with additional features, authentication context, and protected routes.

## 5. Interactions

*   **'Final UI' and 'Backend' Communication:**
    *   The `Final UI` frontend communicates with the `backend` via HTTP API calls.
    *   The `AuthContext` in `Final UI` uses `getCurrentUser(token)` which calls an API endpoint (likely `GET /api/users/me` on the backend) to validate the session token and fetch user data.
    *   Login/signup forms on the frontend would submit data to backend endpoints like `POST /api/auth/login` and `POST /api/auth/register`.
    *   Profile updates, job applications, and other data-mutating actions on the frontend would trigger corresponding API calls (e.g., `PUT /api/users/profile`, `POST /api/users/resume`).
    *   The backend responds with JSON data, including JWTs for authentication.

## 6. Observations and Potential Areas for Further Investigation

*   **Code Duplication:**
    *   Significant duplication exists between `Login Signup Landing/app/page.tsx` and `Final UI/app/page.tsx`. This confirms `Login Signup Landing` is likely an older version or a direct source for the `Final UI` landing page.
    *   UI components (like `Button`, `Card` from Shadcn UI) are designed for reusability, which is good. The `components/ui` directory structure promotes this.
*   **Modularity:**
    *   Good separation of concerns between the `Final UI` (frontend) and `backend`.
    *   Backend routes are modularized (`authRoutes.js`, `userRoutes.js`).
    *   Frontend components are also structured for reusability.
*   **Environment Configuration:**
    *   Both frontend (implicitly for Firebase via `NEXT_PUBLIC_` vars in `lib/firebase.ts`) and backend (`.env.example` for database, JWT, port) rely on environment variables, which is good practice.
    *   The backend's `db/index.js` explicitly loads `.env` from the `backend` root.
*   **Database Migrations:**
    *   Raw SQL files are used for database migrations (`001_...`, `002_...`). This is a valid approach. A migration runner tool (not visible in the provided files) would typically be used to apply these sequentially.
*   **Error Handling:**
    *   The backend has a global error handler in `index.js` and local `try...catch` blocks in route handlers. Some backend routes use `next(err)` to pass errors to the global handler.
    *   Frontend error handling was not deeply analyzed but would be crucial for user experience.
*   **Testing:**
    *   No dedicated test files or testing scripts (beyond a placeholder in `backend/package.json`) were observed in the provided file listings. This is a significant area for improvement.
*   **Security:**
    *   **Backend:**
        *   JWTs are used for authentication, which is standard.
        *   Passwords are hashed with `bcryptjs`.
        *   Parameterized queries in `db/index.js` help prevent SQL injection.
        *   CORS is enabled.
        *   Input validation is present in `authRoutes.js` for registration. More comprehensive validation across all input points would be necessary.
    *   **Frontend:**
        *   `authMiddleware` in the backend protects API routes.
        *   `ProtectedRoute` component in the frontend handles client-side route protection.
    *   Further investigation would be needed for XSS, CSRF, detailed input sanitization, and security of file uploads.
*   **Completeness & Potential Features:**
    *   The structure implies features like messaging, advanced search/filtering for users/companies, network building (following, connecting), and potentially a dashboard for users/companies.
    *   The `user_profiles` table contains many fields for preferences (job status, desired roles, salary expectations, hiring status, etc.) that suggest a matching or recommendation engine could be a core feature.
    *   The `is_phone_verified` field in `users` table and the `/api/auth/mark-as-verified` route suggest a phone verification flow.
    *   No billing or subscription-related infrastructure was observed.

This analysis provides a foundational understanding of the project. Further investigation into specific business logic within route handlers, the exact implementation of Firebase for UI auth, and the details of any matching algorithms would provide deeper insights.
