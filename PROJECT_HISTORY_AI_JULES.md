# Project History - AI Jules

## Introduction

This document outlines the analysis, migrations, fixes, and current known issues for this project, as performed by the AI agent Jules. Its purpose is to provide context and history for future AI models or human developers.

## Initial Project State (As Understood by AI Jules)

The repository initially contained two distinct Next.js projects:

1.  **`Final UI`**: The main application, appearing to be a professional networking platform (e.g., "100Networks"). It included features for user feeds, job listings, company profiles, etc., but all data was hardcoded.
2.  **`Login Signup Landing`**: A separate application handling the initial landing page, user login, signup, and a multi-step onboarding flow. This project also used hardcoded data and mocked interactions.

Key observations about the initial state:
*   Both projects were UI prototypes with no backend integration.
*   Significant UI code duplication existed, especially a shared set of primitive UI components (likely Shadcn/UI based) in `components/ui/` and common hooks/utilities.
*   Both projects used Tailwind CSS.

## Phase 1: Initial Analysis (Summary)

A detailed analysis was performed on both projects:

*   **Code Structure**: Both used Next.js App Router conventions. `Final UI` was substantially larger.
*   **State Management**: Primarily local component state (`useState`). React Context was used by the UI library and for theme management (`next-themes`), but not for global application state (e.g., user sessions). A hardcoded `userType` was noted in `Login Signup Landing`'s onboarding stepper.
*   **API Interactions**: None implemented. All data was hardcoded. Forms were UI-only.
*   **Code Quality**:
    *   Generally good project structure.
    *   `Final UI`: Had many `any` types, largely due to hardcoded data lacking defined interfaces.
    *   `Login Signup Landing`: Demonstrated better type safety (no `any` types).
    *   The duplication of the UI component library (`components/ui`), hooks (`use-mobile.tsx`, `use-toast.ts`), and utilities (`lib/utils.ts`) was a key finding.
*   **Dependencies**: Both projects used a modern and relevant set of dependencies (Next.js, React, Radix UI, Tailwind CSS). The main issue was duplicated dependency management in their separate `package.json` files.

## Phase 2: Frontend Integration (`Login Signup Landing` into `Final UI`)

The primary goal was to consolidate the two projects into `Final UI`, making it the single application.

1.  **Shared UI Components Consolidation**:
    *   **Decision**: `Final UI`'s versions of shared components (in `components/ui/`), hooks, and utilities would be the source of truth.
    *   **Action**: An attempt was made to delete the duplicated `components/ui/` directory and other shared files from `Login Signup Landing`.
    *   **Outcome**: This step faced tool limitations. Deleting directories or multiple files efficiently was problematic. The logical decision to use `Final UI`'s versions was made, but physical deletion of duplicates in `Login Signup Landing` was largely deferred and ultimately made moot by the (failed) attempt to delete the entire `Login Signup Landing` folder later.

2.  **Landing Page Migration**:
    *   The content of `Login Signup Landing/app/page.tsx` (the detailed marketing landing page) was migrated to become the new root page of `Final UI` (initially `Final UI/app/page.tsx`).
    *   The `Logo` component (`logo.tsx`) was copied from `Login Signup Landing/components/` to `Final UI/components/`.
    *   **Known Issue Created**: Image assets referenced by this page were not copied due to tool limitations for binary file handling.

3.  **Login Page Migration**:
    *   Content from `Login Signup Landing/app/login/page.tsx` was migrated to `Final UI/app/auth/login/page.tsx`.
    *   Internal links (e.g., to signup) were updated to `/auth/signup`.
    *   **Known Issue**: Referenced image asset not copied.

4.  **Signup Page Migration**:
    *   Content from `Login Signup Landing/app/signup/page.tsx` was migrated to `Final UI/app/auth/signup/page.tsx`.
    *   Internal links (e.g., to login, onboarding) were updated (e.g., `/auth/login`, `/auth/onboarding/verify-email`).
    *   **Known Issue**: Referenced image asset not copied.

5.  **Onboarding UI Shell Migration**:
    *   The `OnboardingStepper` component was migrated from `Login Signup Landing/components/` to `Final UI/components/`. Its internal navigation links were updated to use the `/auth/onboarding/...` paths.
    *   The onboarding layout (`Login Signup Landing/app/onboarding/layout.tsx`) was migrated to `Final UI/app/auth/onboarding/layout.tsx`.
    *   All individual onboarding step pages (culture, done, preferences, profile, resume, verify-email, and profile/loading.tsx) were migrated to `Final UI/app/auth/onboarding/`, with their internal navigation links updated.
    *   **Known Issue**: Any image assets referenced in these pages were not copied.

6.  **Navigation Update in `Final UI`**:
    *   The "Log out" link in `Final UI/components/header.tsx` was updated to point to `/` (the new main landing page).

7.  **Attempted Cleanup of `Login Signup Landing` Project**:
    *   An attempt was made to delete the entire `Login Signup Landing` directory.
    *   **Outcome**: FAILED due to persistent tool limitations with `run_in_bash_session rm -rf` on directories (sandbox error: "Failed to compute affected file count"). The `Login Signup Landing` directory remains.

## Phase 3: Post-Migration Fixes & Verification

1.  **Fix: Landing Page Header Display**:
    *   **Issue**: User reported the landing page's unique header (with "For Company" / "For Individual" buttons) was not displaying correctly.
    *   **Action**: A dedicated layout `Final UI/app/(landing)/layout.tsx` was created for the landing page to isolate it from the main app's `HeaderWrapper`. The landing page was moved to `Final UI/app/(landing)/page.tsx`.
    *   **Verification**: Confirmed the code for the unique header was indeed present in the migrated page content.

2.  **Fix: Landing Page Styling**:
    *   **Issue**: User reported missing colors on landing page buttons (e.g., "Get Started" button, "For Company" / "For Individual" buttons).
    *   **Action**: Compared `tailwind.config.ts` from both projects. Identified custom "brand-*" colors in `Login Signup Landing`'s config that were missing in `Final UI`'s. Merged these custom brand colors into `Final UI/tailwind.config.ts`.
    *   **Outcome**: User confirmed this fixed the styling issues.

3.  **Verification: `Final UI` Independence**:
    *   **Action**: Scanned `Final UI` for any code import dependencies on the `Login Signup Landing` folder.
    *   **Outcome**: No direct code import dependencies were found. `Final UI` uses `@/` aliases that resolve internally.

## Phase 4: Backend Development (Node.js/Express/PostgreSQL)

This phase focused on setting up the foundational elements of the backend API.

1.  **Project Initialization**:
    *   A `backend` directory was created.
    *   `package.json` was initialized (manually, due to `npm init -y` failing in the sandbox).
    *   Dependencies (`express`, `pg`, `jsonwebtoken`, `bcryptjs`, `dotenv`, `cors`) and devDependencies (`nodemon`) were added to `package.json` (manually, as `npm install` failed).
    *   Basic server setup in `backend/index.js` with Express, CORS, and JSON parsing middleware.
    *   A `.gitignore` file was added for Node.js projects.
    *   Scripts for `start`, `dev`, and `test` were added to `package.json`.
    *   **Known Issue**: `npm install` commands failed in the sandbox. The `node_modules` directory is missing, and dependencies are not actually installed. The backend is not runnable in its current state. (This was later resolved by the AI in Phase 6).

2.  **Environment Configuration**:
    *   `.env` and `.env.example` files were created in the `backend` directory.
    *   Variables for database connection (HOST, PORT, USER, PASSWORD, NAME), server PORT, JWT_SECRET, and JWT_EXPIRES_IN were defined.
    *   `NODE_ENV=development` was added to `.env`.

3.  **Database Setup**:
    *   A database connection module (`backend/db/index.js`) was created using `pg` (Pool).
    *   An SQL migration script (`backend/db/migrations/001_create_users_table.sql`) was created for the `users` table. This schema includes:
        *   `id`, `email` (unique, NOT NULL), `password_hash` (NOT NULL), `user_type` ('individual' or 'company', NOT NULL).
        *   Optional fields: `full_name`, `company_name`, `industry`, `company_size`.
        *   Timestamps: `created_at`, `updated_at` (with an auto-update trigger).
        *   An index on `LOWER(email)` for case-insensitive unique email checks.
    *   **Known Issue**: The `pg` package is not installed, so the DB connection module is not functional. (This was later resolved by the AI in Phase 6).

4.  **Authentication Routes (`backend/routes/authRoutes.js`)**:
    *   **POST `/api/auth/register`**: Implemented user registration logic, including:
        *   Basic input validation (email, password, user_type, conditional full_name/company_name).
        *   Email format and password length checks.
        *   Checking for existing users by email (case-insensitive).
        *   Password hashing using `bcryptjs`.
        *   Conditional INSERT query based on `user_type`.
        *   Returns new user data (excluding password hash) or error messages.
    *   **POST `/api/auth/login`**: Implemented user login logic, including:
        *   Input validation.
        *   User retrieval by email (case-insensitive).
        *   Password comparison using `bcrypt.compare`.
        *   JWT generation upon successful login, using `JWT_SECRET` and `JWT_EXPIRES_IN` from `.env`.
        *   Returns token and basic user data.
    *   These routes were mounted in `backend/index.js` under the `/api/auth` prefix.
    *   **Known Issue**: Dependencies (`express`, `bcryptjs`, `jsonwebtoken`, `pg`) are not installed. (This was later resolved by the AI in Phase 6).

5.  **User Profile Route (`backend/routes/userRoutes.js`)**:
    *   **GET `/api/users/me`**: Implemented logic to fetch the current user's profile.
        *   Protected by `authMiddleware` (see below).
        *   Retrieves user ID from the JWT payload (`req.user.userId`).
        *   Fetches user details from the database (excluding password hash).
    *   These routes were mounted in `backend/index.js` under the `/api/users` prefix.
    *   **Known Issue**: Dependencies are not installed. (This was later resolved by the AI in Phase 6).

6.  **Authentication Middleware (`backend/middleware/authMiddleware.js`)**:
    *   Created JWT verification middleware.
    *   Extracts Bearer token from `Authorization` header.
    *   Verifies token using `jwt.verify` and `process.env.JWT_SECRET`.
    *   Attaches decoded payload to `req.user`.
    *   Handles errors like missing/invalid token, `TokenExpiredError`, `JsonWebTokenError`.
    *   **Known Issue**: `jsonwebtoken` is not installed. (This was later resolved by the AI in Phase 6).

7.  **Error Handling in `backend/index.js`**:
    *   Enhanced the global error handler to return JSON responses with `status`, `statusCode`, and `message`.

## Phase 5: Frontend Connection to Backend (Initial Steps)

This phase involved setting up the frontend to communicate with the (not-yet-runnable) backend.

1.  **Environment Configuration (`Final UI/.env.local.example`)**:
    *   Created `.env.local.example` in `Final UI` with `NEXT_PUBLIC_API_URL=http://localhost:3001/api`.

2.  **API Service Module (`Final UI/lib/api/index.ts`)**:
    *   Created a generic `request` function using `fetch` to interact with the backend.
        *   Handles base URL, default headers (`Content-Type: application/json`).
        *   Includes error handling for non-ok HTTP responses, attempting to parse JSON error messages.
        *   Handles 204 No Content responses.
        *   Added console logging for `NEXT_PUBLIC_API_URL` and the full request URL for debugging.
    *   Implemented specific API functions using the `request` utility:
        *   `registerUser(userData)`: POST to `/auth/register`.
        *   `loginUser(credentials)`: POST to `/auth/login`.
        *   `getCurrentUser(token)`: GET to `/users/me` (includes Authorization header).
    *   **Note**: `NEXT_PUBLIC_API_URL` needs to be set in a `.env.local` file in `Final UI` for these to work.

3.  **Authentication Context (`Final UI/context/AuthContext.tsx`)**:
    *   Created `AuthContext` with `AuthProvider` and `useAuth` hook.
    *   Manages `user`, `token`, and `isLoading` states.
    *   `login` function: Stores token in `localStorage`, updates context state.
    *   `logout` function: Removes token from `localStorage`, clears context state.
    *   **Updated** `useEffect` in `AuthProvider` to:
        *   Check `localStorage` for `authToken` on initial mount.
        *   If token exists, call `getCurrentUser` API to validate token and fetch user data.
        *   Update context with user/token if valid; call `logout` if invalid/error.
        *   Set `isLoading` appropriately.

4.  **Integrating Auth into UI Components**:
    *   **`Final UI/app/layout.tsx` (Root Layout)**:
        *   Wrapped with `AuthProvider`.
        *   Added `Toaster` component from `sonner` for notifications.
        *   Implemented conditional rendering of `ProtectedRoute` based on `pathname` (public paths like `/auth/login`, `/auth/signup`, `/auth/onboarding` bypass `ProtectedRoute`).
        *   Conditionally renders `HeaderWrapper` to hide it on public auth/onboarding paths.
    *   **`Final UI/components/header.tsx`**: Made auth-aware:
        *   Uses `useAuth` to get `user`, `isLoading`.
        *   Conditionally renders navigation and user actions based on auth state.
        *   Logout button now calls `auth.logout()` and redirects to `/`.
        *   Logo link behavior updated based on auth state.
    *   **`Final UI/app/auth/signup/page.tsx`**:
        *   Integrated `react-hook-form` and `zod` for client-side validation.
        *   Calls `registerUser` API on submit.
        *   Uses `sonner` (`toast`) for success/error notifications.
    *   **`Final UI/app/auth/login/page.tsx`**:
        *   Integrated `react-hook-form` and `zod`.
        *   Calls `loginUser` API on submit.
        *   On success, calls `auth.login(token, user)` and redirects to `/feed`.
        *   Uses `sonner` (`toast`) for notifications.
    *   **`Final UI/components/auth/ProtectedRoute.tsx`**: Implemented component to redirect unauthenticated users to `/auth/login`, showing loading/redirecting messages.

## Phase 6: Getting the Application Running and Fixing Onboarding Stepper

This phase focused on resolving dependency issues, guiding the user through manual setup, and fixing a key UI component.

1.  **Backend Dependencies Installation**:
    *   Successfully ran `npm install` in the `backend/` directory.
    *   `npm audit fix` was attempted, but a `semver` high-severity vulnerability within `nodemon`'s dependencies remained. This was noted as a non-blocking issue for development purposes.

2.  **Frontend Dependencies Installation Attempt**:
    *   **Outcome**: FAILED. Attempts to run `pnpm install` and `npm install` (with various strategies like clearing cache, removing lockfiles, using `--legacy-peer-deps`) in the `Final UI/` directory consistently failed due to a persistent sandbox error: "Failed to compute affected file count and total size after command execution."
    *   **Guidance**: The user was advised that this step would need to be performed manually.

3.  **Image Asset Migration Guidance**:
    *   Due to tool limitations with binary files (and previous failures with `cp`), the AI advised the user to manually copy image assets from `Login Signup Landing/public/` to `Final UI/public/`.

4.  **Database and Environment Setup Guidance**:
    *   The AI provided detailed instructions for the user to manually:
        *   Set up the PostgreSQL database (create DB, user, run migrations).
        *   Configure environment variables by creating and populating `.env` in `backend/` and `.env.local` in `Final UI/`.

5.  **User Confirmation of Running Application**:
    *   The user confirmed that after performing the manual setup steps (especially creating the `.env` files and presumably installing frontend dependencies and setting up the DB), both the backend and frontend applications were running successfully.

6.  **`Login Signup Landing` Directory Deletion Attempt**:
    *   **Outcome**: FAILED. An attempt to delete the `Login Signup Landing/` directory using `rm -rf` also failed with the same persistent sandbox error ("Failed to compute affected file count...").
    *   **Guidance**: The user was advised this would also need manual deletion.

7.  **Onboarding Stepper Fix (`Final UI/components/onboarding-stepper.tsx`)**:
    *   Successfully modified the component to derive `userType` from `AuthContext` (via `useAuth` hook) instead of using a hardcoded `useState` value.
    *   Added loading state display while `isAuthLoading` is true.
    *   Added a fallback UI (error message) if `userType` is not determined after loading, to prevent runtime errors.

## Current Project Status

*   **Frontend**: `Final UI` contains the merged UIs. It has an API service layer, authentication context, protected routes, and toast notifications. Login and Signup forms interact with the backend. The `OnboardingStepper` now correctly uses the authenticated user's type.
*   **Backend**: The Node.js/Express backend is **runnable** as dependencies were successfully installed by the AI. It provides endpoints for user registration, login, and fetching user profiles. Database schema for users is defined.
*   **Connectivity**: Frontend and backend are connected and, as per user confirmation, are functional when manually set up correctly.
*   **Key Changes in this Phase**:
    *   Backend dependencies are now installed.
    *   `OnboardingStepper` hardcoding is fixed.
*   **Persistent Sandbox/Tool Issues**:
    *   Frontend dependencies (`Final UI/`) could not be installed by the AI.
    *   Image assets from `Login Signup Landing` could not be migrated by the AI.
    *   The `Login Signup Landing` directory could not be deleted by the AI.

## Next Steps for User (Manual Intervention Required)

1.  **Frontend Dependencies (If Not Already Done)**: If not yet completed, navigate to the `Final UI` directory and run `pnpm install` (or `npm install`/`yarn install`) to install all frontend packages.
2.  **Database Setup (If Not Already Done)**:
    *   Ensure PostgreSQL is installed and running.
    *   Create the database `flexbone_db` and user `flexbone_user` with password `flexbone_password` (or update `.env` in `backend/` with actual credentials if different).
    *   Run the migration script `backend/db/migrations/001_create_users_table.sql` against the database to create the `users` table.
3.  **Environment Files (If Not Already Done)**:
    *   In `Final UI`, copy `.env.local.example` to `.env.local` and ensure `NEXT_PUBLIC_API_URL=http://localhost:3001/api` (or adjust if backend runs on a different port).
    *   In `backend`, ensure `.env` has the correct `JWT_SECRET`, `DB_` variables for your local PostgreSQL setup, etc.
4.  **Image Assets (If Not Already Done)**: Manually copy the missing image assets from `Login Signup Landing/public/` to `Final UI/public/`. This is crucial for the landing page, login, and signup pages to render correctly.
5.  **Delete `Login Signup Landing` Directory (Recommended)**: Manually delete the entire `Login Signup Landing/` directory from the project root, as it's now deprecated and its relevant parts have been migrated or superseded.
6.  **Run Both Applications (If Not Already Done/Testing)**:
    *   Start the backend server (e.g., `npm run dev` in the `backend` directory).
    *   Start the frontend Next.js development server (e.g., `npm run dev` in the `Final UI` directory).
    *   Test registration, login, and the initial onboarding flow to ensure `userType` is correctly handled.

## Next Steps for AI (If Further Work is Requested)

1.  **Implement Onboarding API Endpoints**: Create backend routes and database logic for saving all user onboarding data (profile details, preferences, resume path, culture fit answers).
2.  **Connect Onboarding Frontend**: Update the frontend onboarding pages (profile, preferences, resume, culture) to submit data to these new backend endpoints using the API service.
3.  **User Profile Management**:
    *   Implement backend logic for creating/updating detailed user profiles (beyond initial registration fields). This would involve new tables (e.g., `user_profiles`, `experiences`, `education`).
    *   Create frontend UI for profile viewing and editing.
4.  **Password Reset/Forgot Password**: Implement this functionality (backend routes for token generation/validation, email sending (mocked/logged for now), frontend pages).
5.  **Refine Error Handling & UX**: Improve user feedback, loading states, and error display across the application, especially for API interactions.
6.  **Type Safety**: Add specific TypeScript types for API payloads (request/response) and database models, replacing `any` where used, particularly in `Final UI/lib/api/index.ts` and context.
7.  **Testing**: Add unit tests for backend logic (especially API routes and services) and potentially UI component tests for critical parts of the frontend.
8.  **Resolve `semver` Vulnerability (Optional/If Critical)**: Investigate workarounds or alternative packages if the `semver` vulnerability in `nodemon`'s dependency chain becomes a critical issue. This might involve overriding dependencies or waiting for upstream fixes.
```
