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
(Details of migrations omitted for brevity - see previous versions if needed)

## Phase 3: Post-Migration Fixes & Verification

(Details omitted for brevity)

## Phase 4: Backend Development (Node.js/Express/PostgreSQL)

(Details omitted for brevity)

## Phase 5: Frontend Connection to Backend (Initial Steps)

(Details omitted for brevity)

## Phase 6: Getting the Application Running and Fixing Onboarding Stepper

This phase focused on resolving dependency issues, guiding the user through manual setup, and fixing key UI components and flows.

1.  **Backend Dependencies Installation**: Successful. Noted `semver` vulnerability.
2.  **Frontend Dependencies Installation Attempt**: FAILED due to sandbox errors. User advised to do manually.
3.  **Image Asset Migration Guidance**: Provided for manual copying.
4.  **Database and Environment Setup Guidance**: Provided for manual setup.
5.  **User Confirmation of Running Application**: User confirmed success after manual steps.
6.  **`Login Signup Landing` Directory Deletion Attempt**: FAILED due to sandbox errors. User advised to do manually.
7.  **Onboarding Stepper Fix (`Final UI/components/onboarding-stepper.tsx`)**: `userType` now from `AuthContext`.
8.  **Signup Redirection Fix (`Final UI/app/auth/signup/page.tsx`)**: Implemented auto-login and redirect to onboarding. User confirmed fix.

## Phase 7: Implementing Functional Onboarding Profile Page

This phase focused on making the first data collection step of the onboarding flow (`/auth/onboarding/profile`) fully functional.

*   **Analysis of Frontend and Backend**:
    *   Reviewed `Final UI/app/auth/onboarding/profile/page.tsx`, noting its prior reliance on URL query parameters for `userType` and its lack of actual form submission logic or connection to user authentication state.
    *   Reviewed the existing `users` table schema to identify fields that could be populated/updated at this stage (like `full_name`, `company_name`, etc.) and determined the need for additional profile-specific fields.

*   **Profile Field Definition**:
    *   A comprehensive set of profile fields was defined for both 'individual' and 'company' user types, covering areas like location, bio, professional details (title, experience, skills, education for individuals), and company specifics (type, tech stack for companies), along with common fields like LinkedIn/website URLs.
    *   To maintain a clean structure for the `users` table and accommodate the diverse profile information, the decision was made to create a new `user_profiles` table.

*   **Backend Modifications**:
    *   **New Migration**: Created `backend/db/migrations/002_create_user_profiles_table.sql`. This script defines the `user_profiles` table with columns such as `user_id` (as a foreign key to `users.id` with `ON DELETE CASCADE`), `location`, `professional_title`, `years_of_experience`, `job_function`, `key_skills`, `education_level`, `field_of_study`, `institution`, `linkedin_url`, `website_url`, `bio`, `company_type`, `tech_stack`, and includes timestamps with an auto-update trigger for `updated_at`.
    *   **Profile Update Endpoint**: Implemented a new API endpoint `PUT /api/users/profile` in `backend/routes/userRoutes.js`. This endpoint:
        *   Is protected by `authMiddleware` to ensure only authenticated users can update their own profiles.
        *   Uses database transactions to ensure atomicity when writing to multiple tables.
        *   Dynamically updates fields in the `users` table (e.g., `full_name`, `company_name`) if they are provided in the request.
        *   Performs an "upsert" (insert or update on conflict) operation into the `user_profiles` table using the `user_id` as the conflict target.

*   **Frontend API Service Update**:
    *   Added a new function `updateUserProfile(profileData, token)` to `Final UI/lib/api/index.ts`. This function is responsible for making a `PUT` request to the new `/api/users/profile` backend endpoint, including the authentication token and profile data in the request.

*   **Frontend Profile Page Refactor (`Final UI/app/auth/onboarding/profile/page.tsx`)**:
    *   The page was significantly refactored to be a fully functional form.
    *   Integrated `useAuth` from `AuthContext` to get the authenticated `user` object, `token`, and `userType`, replacing the old URL query param method for determining user type.
    *   Loading states and checks for authenticated user presence were added.
    *   Implemented `react-hook-form` for robust form state management.
    *   Defined Zod schemas (`commonProfileSchema`, `individualProfileSchema`, `companyProfileSchema`) for client-side validation, with the active schema chosen based on `userType`.
    *   The form UI was updated to use `react-hook-form`'s `register` and `Controller` methods for field registration and state binding.
    *   Form fields are now conditionally rendered based on `userType`.
    *   Implemented data prefilling: `defaultValues` for the form are populated from the `AuthContext`'s `user` object (for fields in the `users` table like `full_name` or `company_name`) and from `user.profile` (assuming `getCurrentUser` in `AuthContext` will be updated to fetch and join data from `user_profiles`).
    *   The form's `onSubmit` handler now calls the `updateUserProfile` API service function.
    *   User feedback is provided using `sonner` toast notifications for success or failure of the profile update.
    *   Upon successful profile update, the user's data in `AuthContext` is refreshed by calling `refetchUser()`, and the user is then redirected to the next step in the onboarding flow (`/auth/onboarding/preferences`).

## Current Project Status

*   **Frontend**: `Final UI` now has a functional "Profile" step in the onboarding flow. This page dynamically adapts to the `userType` from `AuthContext`, uses `react-hook-form` for form handling and Zod for validation, pre-fills data from the user session, and submits updates to the backend. The `OnboardingStepper` and signup flow are also functioning correctly.
*   **Backend**: The Node.js/Express backend is runnable. It has API endpoints for registration, login, fetching the current user, and now, for updating the user's profile (affecting both `users` and the new `user_profiles` tables).
*   **Database**: A new `user_profiles` table schema has been defined in `backend/db/migrations/002_create_user_profiles_table.sql` to store detailed profile information, linked to the `users` table.
*   **Connectivity**: The frontend profile form is connected to the backend `PUT /api/users/profile` endpoint.
*   **Key Changes in Phase 6 & 7**:
    *   Backend dependencies installed.
    *   `OnboardingStepper` hardcoding fixed.
    *   Signup redirection logic fixed.
    *   Onboarding "Profile" page is now functional for data collection and submission.
*   **Persistent Sandbox/Tool Issues**:
    *   Frontend dependencies (`Final UI/`) installation remains a manual task for the user.
    *   Image asset migration from `Login Signup Landing` remains a manual task.
    *   The `Login Signup Landing` directory deletion remains a manual task.

## Next Steps for User (Manual Intervention Required)

1.  **Frontend Dependencies (If Not Already Done)**: Navigate to `Final UI` and run `pnpm install` (or equivalent).
2.  **Database Setup (If Not Already Done)**:
    *   Ensure PostgreSQL is running.
    *   Create database/user if not already done (e.g., `flexbone_db`, `flexbone_user`).
    *   Run the initial migration: `psql -U your_pg_user -d flexbone_db -f backend/db/migrations/001_create_users_table.sql`.
    *   **NEW**: Run the new migration for user profiles: `psql -U your_pg_user -d flexbone_db -f backend/db/migrations/002_create_user_profiles_table.sql`.
3.  **Environment Files (If Not Already Done)**: Ensure `.env` (backend) and `.env.local` (frontend) are correctly configured.
4.  **Image Assets (If Not Already Done)**: Manually copy from `Login Signup Landing/public/` to `Final UI/public/`.
5.  **Delete `Login Signup Landing` Directory (Recommended)**: Manually delete this directory.
6.  **Run Both Applications & Test**:
    *   Start backend (`npm run dev` in `backend`).
    *   Start frontend (`npm run dev` in `Final UI`).
    *   Thoroughly test: Registration -> Login -> Onboarding Stepper (Verify Email step -> Profile step).
        *   Confirm profile page pre-fills `full_name` (individual) or `company_name` (company) from signup.
        *   Fill out and submit the profile form for both an individual and a company user.
        *   Verify data persistence by reloading or by checking the database directly (`users` and `user_profiles` tables).
        *   Confirm redirection to `/auth/onboarding/preferences` occurs.

## Next Steps for AI (If Further Work is Requested)

1.  **Implement Onboarding API Endpoints (Remaining Steps)**:
    *   **Partially Complete (Profile)**: The profile data submission is handled by `PUT /api/users/profile`.
    *   **TODO**: Define and implement backend logic for:
        *   Email verification status update (if not implicitly handled).
        *   Saving Job Preferences (new table `user_preferences` likely needed).
        *   Saving Work Culture Fit answers (new table `user_culture_fit_responses` likely needed).
        *   Handling Resume/CV upload/storage (complex; requires decision on storage strategy - e.g., file path in DB, cloud storage).
2.  **Connect Onboarding Frontend (Remaining Steps)**:
    *   **Partially Complete (Profile)**: Profile page is connected.
    *   **TODO**: Implement form handling and API submission for:
        *   `Final UI/app/auth/onboarding/verify-email/page.tsx` (if it needs to call an API to mark as verified or resend verification).
        *   `Final UI/app/auth/onboarding/preferences/page.tsx`.
        *   `Final UI/app/auth/onboarding/culture/page.tsx`.
        *   `Final UI/app/auth/onboarding/resume/page.tsx`.
    *   These pages will need similar refactoring as the profile page (Zod schemas, `react-hook-form`, API service functions, context integration).
3.  **Update `getCurrentUser` for Profile Data**: Modify `GET /api/users/me` in `backend/routes/userRoutes.js` and `getCurrentUser` in `AuthContext` to fetch and include data from `user_profiles` table, so that profile information is available throughout the app and pre-fills correctly on subsequent visits to the profile page.
4.  **User Profile Management (Post-Onboarding)**:
    *   Implement backend logic for creating/updating detailed user profiles beyond onboarding.
    *   Create frontend UI for profile viewing and editing.
5.  **Password Reset/Forgot Password**: Implement this functionality.
6.  **Refine Error Handling & UX**: Continue to improve across the application.
7.  **Type Safety**: Add specific TypeScript types for API payloads and database models for all new features.
8.  **Testing**: Add unit and integration tests.
9.  **Resolve `semver` Vulnerability (Optional/If Critical)**.
```
