
# ✅ **Phase 1 in Express: Features Covered**
1. **Express-based Proxy**  
   - Set up a basic proxy server using `http-proxy-middleware`.

2. **Forward Requests to Backend**  
   - Proxy server forwards all incoming `/api` requests to the backend server.

3. **Route-based Forwarding (`/api`)**  
   - Created `/api` route to handle all proxied requests.

# ✅ **Phase 2 in Express: Features Covered**
1. **JWT-based Authentication**  
   - Implemented JWT authentication with cookies using `jsonwebtoken` and `cookie-parser`.

2. **Backend Auth Routes (`/auth/login` and `/protected`)**  
   - Created login route to authenticate users and set JWT token in cookies.  
   - Created protected route to allow access only for authenticated users.

3. **Auth Middleware for Protected Routes**  
   - Auth middleware checks for valid JWT token in cookies and protects routes.

4. **Proxy Server with Authentication**  
   - Proxy server now handles authentication via cookies, forwarding requests to backend after validating JWT.

5. **Cookie Handling (HttpOnly, Secure, SameSite)**  
   - Set cookies with attributes (`httpOnly`, `secure`, `sameSite`) for security purposes.