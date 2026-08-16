# Venta v1.0 — Implementation Plan

## 1. Project Foundation

### 1.1 Repository Structure

- [x] Establish repository structure
- [x] Create `frontend/` directory
- [x] Create `backend/` directory
- [x] Organize project documentation under `docs/`
- [ ] Create root README

### 1.2 Frontend Setup

- [x] Initialize React application with Vite
- [x] Configure Tailwind CSS
- [x] Install and configure React Router
- [x] Verify React Router integration
- [ ] Implement routes defined in TSD
- [ ] Implement protected routes
- [ ] Verify navigation between routes
- [x] Install Zustand
- [ ] Configure Zustand
- [x] Install Axios
- [x] Configure ESLint
- [ ] Configure frontend environment variables
- [x] Establish frontend directory structure
- [x] Verify frontend development server
- [x] Verify linting
- [x] Verify production build

### 1.3 Backend Setup

- [x] Initialize Node.js application
- [x] Install Express
- [x] Install Mongoose
- [x] Install dotenv
- [x] Install CORS
- [x] Install JWT authentication dependencies
- [x] Install bcrypt
- [x] Install and configure ESLint
- [x] Configure environment variables
- [x] Configure Express middleware
- [x] Configure MongoDB connection
- [x] Establish backend directory structure
- [x] Verify linting
- [x] Verify backend API server
- [x] Verify MongoDB connection

### 1.4 Development Environment

- [ ] Create root `.gitignore`
- [ ] Configure frontend environment variables
- [x] Configure backend environment variables
- [ ] Ensure secrets are excluded from Git
- [ ] Establish frontend development command
- [ ] Establish backend development command
- [x] Establish MongoDB development environment
- [ ] Document local setup in README
- [ ] Configure code formatting
- [x] Configure ESLint and formatting integration
- [x] Verify linting and formatting commands

## 2. Authentication & Profiles

### 2.1 User Model

- [x] Create User model
- [x] Implement username
- [x] Implement unique email
- [x] Implement password validation
- [x] Implement password hashing with bcrypt
- [x] Implement user roles (`user`, `admin`)
- [x] Implement user status (`active`, `suspended`)
- [x] Implement `passwordChangedAt`

### 2.2 Registration & Login

- [x] Implement user registration
- [x] Prevent duplicate email registration
- [x] Implement user login
- [x] Generate JWT on login
- [x] Verify JWT authentication flow

### 2.3 Authentication Middleware

- [x] Implement `protect` middleware
- [x] Validate Bearer tokens
- [x] Verify JWT signature
- [x] Detect invalid/expired tokens
- [x] Retrieve authenticated user
- [x] Implement password-change token invalidation
- [x] Test old JWT after password change

### 2.4 Authorization

- [x] Implement `authorize` middleware
- [x] Implement role-based authorization
- [x] Test admin-only routes

### 2.5 User Profile

- [x] Implement authenticated profile endpoint
- [x] Implement password change
- [x] Verify password before changing
- [x] Verify changed password is persisted
- [x] Verify old JWT becomes invalid after password change

### 2.6 User Status

- [x] Add `active` / `suspended` user status
- [ ] Define suspended-user permissions
- [ ] Implement suspended-user restrictions
- [ ] Test suspended-user behavior

## 3. Listings

### 3.1 Listing Model

- [x] Create Listing model
- [x] Associate listing with seller/user
- [x] Implement listing categories
- [x] Implement title validation
- [x] Implement price validation
- [x] Implement description validation
- [x] Implement condition
- [x] Implement location
- [x] Implement deal method
- [x] Implement listing photos
- [x] Implement listing status
- [x] Add listing indexes

### 3.2 Listing CRUD

- [x] Create listing
- [x] Upload listing photos
- [x] Get all listings
- [x] Get individual listing
- [x] Get authenticated user's listings
- [x] Update listing
- [x] Delete listing
- [x] Verify listing ownership

### 3.3 Listing Status

- [x] Implement `pending` status
- [x] Implement `available` status
- [x] Implement `rejected` status
- [x] Implement `sold` status
- [x] Implement `suspended` status
- [x] Allow seller to mark available listing as sold
- [x] Allow seller to mark sold listing as available
- [x] Prevent non-owners from changing seller-controlled status
- [x] Allow admins to update moderation status
- [x] Restrict admin status updates to allowed statuses
- [x] Prevent sellers from changing listings to moderation statuses
- [x] Test listing status authorization

---

## 4. Browse & Search

- [ ] Implement category filtering
- [ ] Implement keyword search
- [ ] Implement price filtering
- [ ] Implement condition filtering
- [ ] Implement location filtering
- [ ] Implement sorting
- [ ] Implement pagination
- [ ] Review available/sold/pending listing visibility rules

---

## 5. Messaging

### 5.1 Conversations

- [x] Create Conversation model
- [x] Associate conversation with listing
- [x] Associate buyer and seller
- [x] Prevent duplicate buyer/listing conversations
- [x] Create conversation endpoint
- [x] Get user's conversations
- [x] Get specific conversation
- [x] Verify conversation participants
- [x] Test non-participant access

### 5.2 Messages

- [x] Create Message model
- [x] Associate message with conversation
- [x] Associate message with sender
- [x] Implement message content validation
- [x] Implement send-message endpoint
- [x] Implement get-messages endpoint
- [x] Verify sender/participant authorization
- [x] Update conversation's `lastMessage`
- [x] Update conversation's `lastMessageAt`

### 5.3 Messaging Improvements

- [ ] Implement message read/unread state
- [ ] Review messaging behavior for sold listings
- [ ] Review messaging behavior for suspended/rejected listings
- [ ] Add additional messaging edge-case tests

---

## 6. Moderation & Admin

### 6.1 Listing Moderation

- [x] Implement admin-only listing status endpoint
- [x] Allow admin to approve listings
- [x] Allow admin to reject listings
- [x] Allow admin to suspend listings
- [x] Prevent regular users from accessing admin status endpoint
- [ ] Define complete moderation workflow
- [ ] Review whether rejected listings can be resubmitted

### 6.2 User Moderation

- [x] Define user `suspended` status in model
- [ ] Implement admin user-management endpoints
- [ ] Implement suspend-user functionality
- [ ] Implement unsuspend-user functionality
- [ ] Define permissions for suspended users
- [ ] Test suspended-user behavior

### 6.3 Admin Security

- [x] Protect admin-only listing route with `authorize`
- [x] Verify controller-level authorization
- [ ] Review all admin endpoints for consistent authorization

---

## 7. AWS Integration & Deployment

- [ ] Define AWS architecture
- [ ] Configure production environment variables
- [ ] Deploy frontend
- [ ] Deploy backend
- [ ] Configure production MongoDB
- [ ] Configure Cloudinary production settings
- [ ] Configure CORS for production
- [ ] Configure domain
- [ ] Configure HTTPS
- [ ] Configure monitoring/logging
- [ ] Review AWS cost controls

---

## 8. Static Pages & UI Polish

- [ ] Implement home page
- [ ] Implement listings/browse page
- [ ] Implement listing details page
- [ ] Implement login/register UI
- [ ] Implement user profile UI
- [ ] Implement seller dashboard
- [ ] Implement messaging UI
- [ ] Implement admin dashboard
- [ ] Implement loading states
- [ ] Implement empty states
- [ ] Implement error states
- [ ] Responsive design review
- [ ] Accessibility review

---

## 9. Testing & Security

### 9.1 Backend Testing

- [x] Test authentication
- [x] Test password change
- [x] Test JWT invalidation after password change
- [x] Test listing ownership
- [x] Test listing status authorization
- [x] Test conversation participant authorization
- [x] Test invalid ObjectId handling
- [x] Test Mongoose validation errors
- [x] Test centralized error handling
- [ ] Test all CRUD endpoints
- [ ] Test all authorization boundaries
- [ ] Test suspended-user behavior
- [ ] Test invalid/malformed request bodies
- [ ] Test unexpected server errors

### 9.2 Security Review

- [x] JWT authentication
- [x] Password hashing
- [x] Password-change token invalidation
- [x] Role-based authorization
- [x] Resource ownership checks
- [x] Centralized error handling
- [ ] Review sensitive data exposure
- [ ] Review request validation
- [ ] Review rate limiting
- [ ] Review security headers
- [ ] Review CORS configuration
- [ ] Review file-upload security
- [ ] Review authorization bypass scenarios
- [ ] Review production error responses

---

## 10. Launch

- [ ] Complete backend testing
- [ ] Complete frontend testing
- [ ] Complete security review
- [ ] Complete production configuration
- [ ] Deploy application
- [ ] Verify production environment
- [ ] Verify authentication in production
- [ ] Verify listings in production
- [ ] Verify messaging in production
- [ ] Verify admin functionality
- [ ] Verify error handling in production
- [ ] Final README
- [ ] Final API documentation
- [ ] Create v1.0 release