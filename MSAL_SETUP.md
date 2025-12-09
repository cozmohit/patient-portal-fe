# Microsoft MSAL Authentication Setup Guide

## 📋 Overview

This document describes the complete Microsoft MSAL authentication implementation for the Patient Portal application. The authentication flow uses Azure Active Directory (Azure AD) with Microsoft MSAL library.

---

## 🏗️ Architecture

### Authentication Flow

```
1. User clicks "Sign in with Microsoft"
   ↓
2. Redirect to Microsoft login page (Azure AD)
   ↓
3. User authenticates with Microsoft credentials
   ↓
4. Microsoft redirects back with auth code
   ↓
5. MSAL acquires access token
   ↓
6. Exchange Azure token with backend API
   ↓
7. Backend returns JWT tokens (access + refresh)
   ↓
8. Store tokens in localStorage
   ↓
9. Redirect to dashboard
   ↓
10. Auth Guard protects routes
    ↓
11. Auth Interceptor adds JWT to API requests
```

---

## 📁 Project Structure

```
src/
├── auth.config.ts                          # MSAL Configuration
├── enviornments/
│   └── enviornment.ts                      # Azure AD Config (tenantId, clientId)
├── styles.scss                             # Global styles with ngx-toastr
├── app/
    ├── app.config.ts                       # App Configuration with MSAL Provider
    ├── app.ts                              # Initialize MSAL & Handle Redirect
    ├── app.routes.ts                       # Routes with Auth Guard
    ├── core/
    │   ├── guards/
    │   │   └── auth.guard.ts               # Route Protection
    │   ├── services/
    │   │   └── login.service.ts            # Login Logic & Token Management
    │   └── interceptors/
    │       ├── auth.interceptor.ts         # Add JWT to HTTP Requests
    │       └── error.interceptor.ts        # Global Error Handling
    └── features/
        ├── auth/
        │   └── login/
        │       ├── login.ts                # Login Component
        │       ├── login.html              # Login UI
        │       └── login.scss              # Login Styles
        └── dashboard/
            └── dashboard/
                ├── dashboard.ts            # Dashboard Component
                ├── dashboard.html          # Dashboard UI
                └── dashboard.scss          # Dashboard Styles
```

---

## 🔧 Configuration Steps

### Step 1: Azure AD Setup

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App Registrations**
3. Click **New registration**
4. Configure your app:
   - **Name**: Patient Portal
   - **Supported account types**: Single tenant
   - **Redirect URI**: `http://localhost:4200` (for development)

5. After registration, note down:
   - **Application (client) ID**
   - **Directory (tenant) ID**

6. Configure **Authentication**:
   - Add redirect URIs for production
   - Enable **ID tokens** and **Access tokens**
   - Set logout URL

7. Configure **API permissions** (if needed):
   - Add required scopes
   - Grant admin consent

### Step 2: Update Environment Configuration

Edit `src/enviornments/enviornment.ts`:

```typescript
export const environment = {
    adConfig: {
        clientId: 'YOUR_AZURE_CLIENT_ID',      // From Step 1
        tenantId: 'YOUR_AZURE_TENANT_ID',      // From Step 1
    },
    apiUrl: 'YOUR_BACKEND_API_URL',            // Your backend API
};
```

### Step 3: Backend API Setup

Your backend needs an endpoint to exchange Azure tokens:

**Endpoint**: `POST /validate-azure-token/`

**Request Body**:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "auth_method": "azure"
}
```

**Response**:
```json
{
  "access": "your_backend_jwt_access_token",
  "refresh": "your_backend_jwt_refresh_token"
}
```

---

## 🚀 Running the Application

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm start
```

The app will be available at `http://localhost:4200`

---

## 🔐 Authentication Components

### 1. MSAL Configuration (`auth.config.ts`)

Configures the MSAL client with Azure AD settings:
- **clientId**: Your Azure AD application ID
- **authority**: Azure AD tenant authority URL
- **redirectUri**: Where Azure redirects after authentication
- **cacheLocation**: Where to store tokens (`sessionStorage`)

### 2. App Initialization (`app.ts`)

- Initializes MSAL on app startup
- Handles redirect from Microsoft login
- Acquires tokens silently
- Exchanges Azure token with backend

### 3. Login Service (`core/services/login.service.ts`)

**Methods**:
- `loginWithMicrosoft()`: Initiates Microsoft login redirect
- `handleAzureLoginSuccess()`: Processes successful Azure authentication
- `isAuthenticated()`: Checks if user is logged in
- `logout()`: Logs out user and clears tokens

**Features**:
- Token exchange with backend
- Token storage in localStorage
- JWT expiration checking
- Error handling with toastr notifications

### 4. Auth Guard (`core/guards/auth.guard.ts`)

Protects routes from unauthorized access:
- Checks authentication status
- Redirects to login if not authenticated
- Applied to protected routes

### 5. Auth Interceptor (`core/interceptors/auth.interceptor.ts`)

Automatically adds JWT to HTTP requests:
- Adds `Authorization: Bearer <token>` header
- Skips auth endpoints
- Handles 401 unauthorized errors

### 6. Error Interceptor (`core/interceptors/error.interceptor.ts`)

Global error handling:
- Displays user-friendly error messages
- Uses ngx-toastr for notifications
- Maps HTTP status codes to messages

---

## 🎨 UI Features

### Login Page

- **Modern gradient background** with animated circles
- **Microsoft branding** with official colors
- **Loading state** during authentication
- **Security indicators** (HIPAA compliant, secure auth)
- **Responsive design** for mobile and desktop

### Dashboard Page

- **Welcome banner** with user info
- **Statistics cards** for medical records, appointments, prescriptions
- **Logout functionality**
- **Protected by auth guard**

---

## 🛡️ Security Features

### Token Management

1. **Access Token**: Short-lived JWT for API requests
2. **Refresh Token**: Long-lived token for getting new access tokens
3. **Session Storage**: MSAL stores Azure tokens in sessionStorage
4. **Local Storage**: Backend JWTs stored in localStorage

### JWT Validation

```typescript
private isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000;
    return Date.now() >= expiry;
  } catch (error) {
    return true;
  }
}
```

### Route Protection

```typescript
{
  path: 'dashboard',
  loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(m => m.Dashboard),
  canActivate: [authGuard],  // Protected route
}
```

---

## 📊 Error Handling

### Toast Notifications

All authentication errors are displayed using ngx-toastr:

- **Success**: Login successful, welcome message
- **Error**: Authentication failures, token exchange errors
- **Info**: Logout notifications
- **Warning**: Session expiration warnings

### Error Types

| Error | Status Code | Message |
|-------|------------|---------|
| Network Error | 0 | "Unable to connect to server" |
| Unauthorized | 401 | "Session expired. Please login again." |
| Forbidden | 403 | "Access denied" |
| Not Found | 404 | "Resource not found" |
| Server Error | 500 | "Internal server error" |

---

## 🧪 Testing the Flow

### Manual Testing Steps

1. **Start the application**
   ```bash
   npm start
   ```

2. **Navigate to login page**
   - Should redirect to `/login` automatically

3. **Click "Sign in with Microsoft"**
   - Should redirect to Microsoft login page
   - Login with your Microsoft credentials

4. **After successful login**
   - Should redirect back to your app
   - Should exchange token with backend
   - Should show success toast
   - Should redirect to dashboard

5. **Test protected routes**
   - Try accessing `/dashboard` directly
   - Should be allowed if authenticated
   - Should redirect to login if not authenticated

6. **Test logout**
   - Click logout button on dashboard
   - Should clear tokens
   - Should redirect to login page

---

## 🔍 Debugging

### Enable MSAL Logging

Add to `auth.config.ts`:

```typescript
export const msalConfig: Configuration = {
    // ... other config
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) return;
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                }
            },
            logLevel: LogLevel.Verbose
        }
    }
};
```

### Common Issues

1. **Redirect Loop**
   - Check redirect URI matches Azure AD configuration
   - Ensure `redirectUri` in `auth.config.ts` is correct

2. **Token Exchange Fails**
   - Verify backend API URL is correct
   - Check backend `/validate-azure-token/` endpoint is working
   - Inspect network tab for error details

3. **Auth Guard Not Working**
   - Check token is stored in localStorage
   - Verify `isAuthenticated()` logic
   - Check JWT expiration

4. **CORS Errors**
   - Configure CORS on backend API
   - Add your frontend URL to allowed origins

---

## 📦 Dependencies

```json
{
  "@azure/msal-angular": "^4.0.0",
  "@azure/msal-browser": "^4.27.0",
  "ngx-toastr": "^19.0.0"
}
```

---

## 🔄 Token Refresh Flow

(To be implemented if needed)

```typescript
// In auth.interceptor.ts
if (error.status === 401) {
  // Try to refresh token
  return this.loginService.refreshToken().pipe(
    switchMap(() => {
      // Retry original request with new token
      return next.handle(this.addAuthHeader(req));
    }),
    catchError(() => {
      // Refresh failed, logout
      this.loginService.logout();
      return throwError(() => error);
    })
  );
}
```

---

## 📝 Best Practices

1. **Never commit secrets** to version control
2. **Use environment files** for configuration
3. **Validate tokens on backend** - never trust client
4. **Implement token refresh** for better UX
5. **Use HTTPS** in production
6. **Set appropriate token expiration** times
7. **Clear tokens on logout** completely
8. **Handle errors gracefully** with user-friendly messages

---

## 🚀 Production Deployment

### Environment Setup

1. Create production environment file:
   ```typescript
   // src/enviornments/enviornment.prod.ts
   export const environment = {
       production: true,
       adConfig: {
           clientId: 'PROD_CLIENT_ID',
           tenantId: 'PROD_TENANT_ID',
       },
       apiUrl: 'https://api.production.com',
   };
   ```

2. Update Azure AD redirect URIs:
   - Add production URL
   - Add staging URL (if applicable)

3. Build for production:
   ```bash
   npm run build
   ```

### Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables configured
- [ ] Azure AD redirect URIs updated
- [ ] CORS properly configured
- [ ] Token expiration appropriate
- [ ] Error messages don't leak sensitive info
- [ ] Logging configured (no PII in logs)
- [ ] Rate limiting on backend
- [ ] Session timeout implemented

---

## 📞 Support

For issues or questions:
1. Check Azure AD configuration
2. Review browser console for errors
3. Check network tab for API failures
4. Verify backend API is responding correctly

---

## 📄 License

© 2024 Patient Portal. All rights reserved.

