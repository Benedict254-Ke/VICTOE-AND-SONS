# Admin Dashboard Architecture Plan

## Overview
Create a separate admin panel within the existing React application for managing users, content, and system settings. The admin panel will be accessible via `/admin/*` routes with authentication.

## Backend Extensions

### Database Models
- **User Model**: For admin users
  - Fields: username, email, password (hashed), role, createdAt, updatedAt
- **Course Model**: For managing courses content
  - Fields: title, description, image, price, duration, createdAt, updatedAt
- **Service Model**: For managing services content
  - Fields: title, description, icon, createdAt, updatedAt
- **Settings Model**: For system settings
  - Fields: key, value, type, createdAt, updatedAt

### Authentication
- Use JWT for token-based auth
- Install bcryptjs for password hashing
- Routes: POST /api/auth/login, POST /api/auth/register (for initial admin)

### API Routes
- **Auth**: /api/auth/login, /api/auth/register
- **Users**: GET /api/users, POST /api/users, PUT /api/users/:id, DELETE /api/users/:id
- **Courses**: GET /api/courses, POST /api/courses, PUT /api/courses/:id, DELETE /api/courses/:id
- **Services**: GET /api/services, POST /api/services, PUT /api/services/:id, DELETE /api/services/:id
- **Settings**: GET /api/settings, PUT /api/settings/:key

All routes except auth require JWT token in Authorization header.

## Frontend Extensions

### Dependencies
- Install: react-router-dom, axios (for API calls), jwt-decode (optional for token parsing)

### Routing Structure
- /admin/login - Admin login page
- /admin/dashboard - Main dashboard
- /admin/users - User management
- /admin/content/courses - Course management
- /admin/content/services - Service management
- /admin/settings - System settings

### Components Structure
```
src/
  admin/
    components/
      Layout.tsx (sidebar + main content)
      Login.tsx
      Dashboard.tsx
      Users.tsx
      Courses.tsx
      Services.tsx
      Settings.tsx
    hooks/
      useAuth.tsx (auth context and hooks)
    utils/
      api.ts (axios instance with interceptors)
```

### Authentication Flow
- Login form submits to /api/auth/login
- On success, store JWT in localStorage
- Use auth context to manage login state
- Protected routes check for token and redirect to login if not authenticated

### UI/UX
- Use existing Tailwind CSS for styling
- Responsive design with sidebar navigation
- Tables for data display with edit/delete actions
- Forms for create/edit operations
- Loading states and error handling

## Implementation Steps
1. Complete backend testing
2. Add authentication dependencies and models
3. Implement auth routes
4. Add CRUD routes for content
5. Install frontend dependencies
6. Set up routing and auth context
7. Create admin components
8. Integrate with APIs
9. Add guards and finalize

## Security Considerations
- JWT tokens with expiration
- Password hashing
- CORS properly configured
- Input validation on backend
- Admin role checks for sensitive operations