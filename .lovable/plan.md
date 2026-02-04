

# Implementation Plan: Extended ConsentMap Features

## Overview

This plan extends the existing ConsentMap application with:
- Sign-up functionality with role selection
- Global login/logout event tracking (Admin-only viewable)
- Enhanced admin header with user details dropdown
- Extended project creation form with Photos, Group Photos, and Consent Form sections
- Consent Excel-like table with status matching and filtering
- Project status panel with matching/not-matching counts
- Integration of the ruixen-contributors-table component

---

## Phase 1: Auth System Extensions

### 1.1 Extend Types (`src/lib/types.ts`)

Add new types for auth events and enhanced data models:

```text
- AuthEvent: { id, userEmail, userName, role, timestamp, type: "login" | "logout" | "signup" }
- Enhanced Person type: Add `consentMatched: boolean` field
- GroupImage type: For multi-person photos
```

### 1.2 Extend Auth Context (`src/lib/auth.tsx`)

Add functionality for:
- `signup(name, email, password, role)` - Create new user in localStorage
- `getAuthEvents()` - Retrieve all auth events
- `clearAuthEvents()` - Admin-only clear function
- Auto-record login/logout/signup events to `consentmap:auth-events` localStorage key
- Store registered users in `consentmap:users` for sign-up persistence

---

## Phase 2: Login & Sign-Up Pages

### 2.1 Update Login Page (`src/pages/Login.tsx`)

Modifications:
- Add "Sign up" toggle button/link
- When toggled, show sign-up form with:
  - Full name input
  - Email input
  - Password input
  - Confirm password input
  - Role selector (Admin/User) with note: "For demo only - production requires admin approval"
- On successful signup:
  - Persist user to `consentmap:users`
  - Auto-login the user
  - Record signup event + login event to auth events

### 2.2 Record Login Events

Modify `login()` in auth context to:
- Push login event to global events list
- Store in `consentmap:auth-events` localStorage

---

## Phase 3: Admin Header & Login History

### 3.1 Create Admin Header Menu (`src/components/ui/admin-header-menu.tsx`)

New component with:
- User avatar/initials
- Dropdown showing:
  - Admin name and email
  - Role badge
  - "View Login History" link (Admin-only, navigates to `/login-history`)
  - Logout button (records logout event)

### 3.2 Create Login History Page (`src/pages/LoginHistory.tsx`)

Admin-only page showing:
- Table of all auth events (login/logout/signup)
- Columns: User Email, User Name, Role, Type, Timestamp
- Descending order by timestamp
- "Clear History" button (Admin-only with confirmation)
- Permission denied message for non-admins

### 3.3 Update Dashboard Layout (`src/components/layout/DashboardLayout.tsx`)

- Replace simple header buttons with AdminHeaderMenu component
- Keep role badge and notification bell

---

## Phase 4: Extended Project Creation Form

### 4.1 Update CreateProject Page (`src/pages/CreateProject.tsx`)

Add new form sections:
- **Username field**: Required, person creating the project
- **Photos section**: Single-person photos upload via FileUpload
  - Preview thumbnails after upload
  - Store in temporary state until form submit
- **Group Photos section**: Multi-person photos upload
  - Preview thumbnails after upload
- **Consent Form section**: PDF/Excel upload
  - Show filename after upload

### 4.2 Update Project Type (`src/lib/types.ts`)

Add to Project interface:
- `groupImages: ImageFile[]` - For group photos
- `createdBy: string` - Username of creator

### 4.3 Update Projects Context (`src/lib/projects.tsx`)

- Add `addGroupImage(projectId, image)` function
- Update `createProject` to accept initial photos/groupPhotos/consent files
- Pre-process uploaded files and store metadata

---

## Phase 5: Consent Excel Table Component

### 5.1 Create Consent Excel Table (`src/components/ui/consent-excel-table.tsx`)

Features:
- Responsive table UI listing persons
- Columns:
  - PID / Name
  - Consent Status (checkmark icon for matched, X/warning for not matched)
  - Consent Document (filename or thumbnail)
  - Uploaded By
  - Timestamp
- Search bar: "Search by PID or name..."
- Filter row: Matching / Not Matching / All
- Column visibility dropdown (pattern from ruixen-contributors-table)
- Client-side sorting by any column
- Summary header: "Total: X | Matching: Y | Not Matching: Z"
- **Admin**: Inline edit or edit modal for consent status
- **User**: Read-only view

Icons used: `Check`, `X`, `AlertTriangle` from lucide-react

### 5.2 Create Project Status Panel (`src/components/ui/project-status-panel.tsx`)

Shows:
- Matching count (persons with `consentMatched === true`)
- Not matching count (total persons - matching)
- Mini progress bar/sparkline visualization
- Updates in real-time when entries are added/edited

---

## Phase 6: Enhanced Project Detail Page

### 6.1 Update ProjectDetail Page (`src/pages/ProjectDetail.tsx`)

Add new sections:
- **Status Panel**: Shows matching/not-matching counts at top
- **Consent Excel Table**: Full consent tracking view
- **Group Images Panel**: Separate from single-person images
- Update Add Person modal to include `consentMatched` toggle

### 6.2 Update Add Person Modal (`src/components/ui/add-person-modal.tsx`)

Add:
- Consent matched checkbox/toggle
- This determines matching status for the consent excel table

---

## Phase 7: Ruixen Contributors Table Integration

### 7.1 Create Component (`src/components/ui/ruixen-contributors-table.tsx`)

Copy the exact component provided in the prompt (verbatim).

### 7.2 Create Demo Page (`src/pages/DemoContributors.tsx`)

- Route: `/demo-contributors`
- Shows the ruixen-contributors-table component
- Add link in sidebar (Admin-only or separate demo section)

---

## Phase 8: Route Updates

### 8.1 Update App.tsx Routes

Add new routes:
- `/login-history` - LoginHistory page (protected)
- `/demo-contributors` - Demo contributors table
- `/signup` (optional - if separate page instead of toggle)

---

## Phase 9: Role-Based Permission Enhancements

### 9.1 Update Permissions Hook (`src/hooks/use-permissions.ts`)

Add:
- `canViewLoginHistory: user?.role === "admin"`
- `canEditConsent: user?.role === "admin"`

### 9.2 Enforce Permissions

All UI components check permissions:
- Delete buttons disabled for users with tooltip
- Edit consent status disabled for users
- Login history link hidden for non-admins
- Toast "Permission denied - admin only" when restricted action attempted

---

## File Summary

### New Files (8)
1. `src/components/ui/admin-header-menu.tsx` - Header dropdown
2. `src/components/ui/consent-excel-table.tsx` - Consent tracking table
3. `src/components/ui/project-status-panel.tsx` - Status counts
4. `src/components/ui/ruixen-contributors-table.tsx` - Exact copy from prompt
5. `src/pages/LoginHistory.tsx` - Admin login history view
6. `src/pages/DemoContributors.tsx` - Demo page for contributors table

### Modified Files (10)
1. `src/lib/types.ts` - Add AuthEvent, update Person, add GroupImage
2. `src/lib/auth.tsx` - Add signup, auth events tracking
3. `src/lib/projects.tsx` - Add groupImages support
4. `src/pages/Login.tsx` - Add sign-up toggle and form
5. `src/pages/CreateProject.tsx` - Extended form with photo sections
6. `src/pages/ProjectDetail.tsx` - Add status panel, consent table
7. `src/components/layout/DashboardLayout.tsx` - Use AdminHeaderMenu
8. `src/components/layout/Sidebar.tsx` - Add demo link (optional)
9. `src/components/ui/add-person-modal.tsx` - Add consentMatched field
10. `src/hooks/use-permissions.ts` - Add new permission checks
11. `src/App.tsx` - Add new routes

---

## Technical Notes

### localStorage Keys
- `consent-map-auth` - Current user session
- `consent-map-projects` - All projects data
- `consentmap:auth-events` - Login/logout/signup events
- `consentmap:users` - Registered users for sign-up

### Production Considerations (Comments in Code)
- File uploads should use backend storage (currently using object URLs)
- Role assignment must be validated server-side
- Auth events should be stored in database
- User registration should include email verification

### Accessibility
- All form inputs have labels
- Interactive elements are keyboard-focusable
- Tooltips for disabled buttons explain restrictions
- Status icons have aria-labels

---

## Acceptance Criteria Verification

1. Sign up creates user in localStorage, allows login
2. Login events persist in `consentmap:auth-events`, viewable by admin only
3. Create Project form has Photos, Group Photos, Consent Form sections
4. Project detail shows matching/not-matching counts that update on add/edit
5. Consent excel table has search bar filtering by PID/Name
6. Admin can delete projects (with confirmation), Users cannot
7. New images uploaded are stored in project.images with preview
8. Role badge shows current role, UI options show/hide correctly
9. ruixen-contributors-table present exactly as provided

