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

(Details omitted for brevity)

## Phase 2: Frontend Integration (`Login Signup Landing` into `Final UI`)

(Details omitted for brevity)

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
    *   A comprehensive set of profile fields was defined for both 'individual' and 'company' user types.
    *   The decision was made to create a new `user_profiles` table for better data organization.

*   **Backend Modifications**:
    *   **New Migration**: Created `backend/db/migrations/002_create_user_profiles_table.sql` for the `user_profiles` table, linked to `users.id`. (Type of `user_id` was initially `UUID`, then corrected to `INTEGER` after user feedback based on system catalog).
    *   **Profile Update Endpoint**: Implemented `PUT /api/users/profile` in `backend/routes/userRoutes.js` for authenticated users, using transactions to update `users` and upsert into `user_profiles`.
    *   **Profile Data in GET /me**: Updated `GET /api/users/me` in `backend/routes/userRoutes.js` to `LEFT JOIN` `user_profiles` and return profile data nested under a `profile` key in the user object.

*   **Frontend API Service Update**:
    *   Added `updateUserProfile(profileData, token)` to `Final UI/lib/api/index.ts`.

*   **Frontend `AuthContext` Update (`Final UI/context/AuthContext.tsx`)**:
    *   Defined `UserProfile` and updated `User` interfaces to include the nested `profile` object.
    *   Added `refetchUser` function to allow components to refresh user data (including profile) from the backend.

*   **Frontend Profile Page Refactor (`Final UI/app/auth/onboarding/profile/page.tsx`)**:
    *   Fully refactored to use `useAuth` for user data and `userType`.
    *   Implemented `react-hook-form` and Zod for schema-based validation (conditional schemas for 'individual'/'company').
    *   Form fields are conditionally rendered and pre-filled from `AuthContext`.
    *   Submits data via `updateUserProfile`, provides toast notifications, and redirects to `/auth/onboarding/preferences` on success, calling `refetchUser`.

*   **Correction of `user_profiles.user_id` Type**:
    *   Initially, `user_profiles.user_id` in `002_create_user_profiles_table.sql` was set to `UUID`.
    *   Based on user feedback that `users.id` is `INTEGER` (from system catalog), the migration was corrected to use `user_id INTEGER UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE`.

*   **Post-Refactor Issues & Resolution Attempts for `profile/page.tsx`**:
    *   **Compilation Errors Reported**: After the extensive refactoring of `Final UI/app/auth/onboarding/profile/page.tsx`, the user reported persistent compilation errors: `Error: 'import', and 'export' cannot be used outside of module code`.
    *   **Cause Identified**: Investigation by the AI confirmed that the error was due to duplicated blocks of code. Specifically, Zod schema definitions, the `export default function ProfilePage()` line, and the `react-hook-form` setup logic (`useForm`, `useEffect`, `onSubmit`) were found to be erroneously duplicated/nested within the main `ProfilePage` function body, while also existing correctly at the module (top) level.
    *   **Repeated Tool Failures to Fix**: Multiple attempts were made by the AI (Jules) using its available tools (specifically `replace_with_git_merge_diff` for targeted fixes) to automatically correct these duplications. These attempts consistently failed. The tool reported "Invalid merge diff: diff did not apply" or that search blocks were not found, even when the search blocks were copied verbatim from the `read_files` output and were clearly visible in that output. An attempt to use `cp` via `run_in_bash_session` to backup the file before trying a full overwrite also failed due to the same persistent sandbox errors ("Failed to compute affected file count...").
    *   **Current Recommendation**: Due to these persistent tool limitations preventing automated correction, the AI is currently unable to reliably fix this specific file (`Final UI/app/auth/onboarding/profile/page.tsx`). The strong recommendation is for the user to **manually edit** the file to remove the identified duplicated code sections from *within* the main `ProfilePage` function body. Only the single, correct top-level (module scope) Zod schema definitions and the single, correct `ProfilePage` component function (with its internal `react-hook-form` logic defined once) should remain.

## Current Project Status

*   **Frontend**:
    *   `Final UI` contains merged UIs, `AuthContext`, API services, protected routes, etc.
    *   The `OnboardingStepper` and signup/login flows are functional.
    *   **CRITICAL ISSUE**: The "Profile" step of onboarding (`Final UI/app/auth/onboarding/profile/page.tsx`) is **blocked by a compilation error** (`Error: 'import', and 'export' cannot be used outside of module code`). This is due to duplicated code sections within the component that the AI could not automatically remove due to tool limitations. **Manual user editing of this file is required.**
*   **Backend**: The Node.js/Express backend is runnable. It has API endpoints for registration, login, fetching the current user (now including profile data), and updating the user's profile (users and `user_profiles` tables).
*   **Database**: The `users` table schema is defined. A new `user_profiles` table schema (`002_create_user_profiles_table.sql`) has been created and corrected to store detailed profile information, linked to `users.id` with an `INTEGER` foreign key.
*   **Connectivity**: The frontend `AuthContext` has been updated to handle nested profile data and includes a `refetchUser` function. The (currently non-compiling) profile page is designed to connect to the backend `PUT /api/users/profile` endpoint.
*   **Persistent Sandbox/Tool Issues**:
    *   Frontend dependencies (`Final UI/`) installation remains a manual task.
    *   Image asset migration from `Login Signup Landing` remains a manual task.
    *   The `Login Signup Landing` directory deletion remains a manual task.
    *   Automated correction of the duplicated code in `profile/page.tsx` failed.

## Next Steps for User (Manual Intervention Required)

1.  **CRITICAL: Manually edit `Final UI/app/auth/onboarding/profile/page.tsx` to remove duplicated code blocks as detailed at the end of Phase 7.** This is essential for the profile page to compile and function.
2.  **Frontend Dependencies (If Not Already Done)**: Navigate to `Final UI` and run `pnpm install` (or equivalent).
3.  **Database Setup (If Not Already Done)**:
    *   Ensure PostgreSQL is running.
    *   Create database/user if not already done.
    *   Run `backend/db/migrations/001_create_users_table.sql`.
    *   Run the corrected `backend/db/migrations/002_create_user_profiles_table.sql`.
4.  **Environment Files (If Not Already Done)**: Ensure correct configuration.
5.  **Image Assets (If Not Already Done)**: Manually copy.
6.  **Delete `Login Signup Landing` Directory (Recommended)**.
7.  **Run Both Applications & Test (after fixing `profile/page.tsx`)**:
    *   Start backend and frontend.
    *   Thoroughly test: Registration -> Login -> Onboarding Stepper (Verify Email step -> Profile step).
        *   Confirm profile page loads and pre-fills data correctly after the manual fix.
        *   Fill out and submit the profile form for both individual and company users.
        *   Verify data persistence and correct structure in `users` and `user_profiles` tables.
        *   Confirm redirection to `/auth/onboarding/preferences` and that `AuthContext` reflects updated user+profile data.

## Next Steps for AI (If Further Work is Requested)

*   **Contingent on Manual Fix**: Further work on onboarding or features relying on a functional profile page depends on the user successfully resolving the compilation error in `Final UI/app/auth/onboarding/profile/page.tsx`.
1.  **Implement Onboarding API Endpoints (Remaining Steps)**:
    *   **Partially Complete (Profile)**.
    *   **TODO**: Email verification, Job Preferences, Work Culture Fit, Resume/CV handling.
2.  **Connect Onboarding Frontend (Remaining Steps)**:
    *   **Partially Complete (Profile - blocked by manual edit)**.
    *   **TODO**: Connect `verify-email`, `preferences`, `culture`, `resume` pages.
3.  **Refine `getCurrentUser` in `AuthContext`**: Ensure `AuthContext` correctly handles the nested `profile` data from `getCurrentUser` API and pre-fills forms accurately (this was part of the `profile/page.tsx` logic but needs verification post-manual-fix).
4.  **User Profile Management (Post-Onboarding)**.
5.  **Password Reset/Forgot Password**.
6.  **Refine Error Handling & UX**.
7.  **Type Safety**.
8.  **Testing**.
9.  **Resolve `semver` Vulnerability (Optional/If Critical)**.
```
