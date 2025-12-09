# Patient Portal - Frontend

A modern, secure patient portal application with Microsoft Azure AD authentication.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Azure AD account
- Backend API running

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200`

### Configuration

Before running, update your Azure AD configuration in `src/enviornments/enviornment.ts`:

```typescript
export const environment = {
    adConfig: {
        clientId: 'YOUR_AZURE_CLIENT_ID',
        tenantId: 'YOUR_AZURE_TENANT_ID',
    },
    apiUrl: 'YOUR_BACKEND_API_URL',
};
```

## 📋 Features

- ✅ **Microsoft Azure AD Authentication** - Secure single sign-on
- ✅ **Beautiful Modern UI** - Gradient backgrounds, animations, responsive design
- ✅ **Protected Routes** - Auth guard for secure pages
- ✅ **JWT Token Management** - Automatic token handling
- ✅ **Error Handling** - User-friendly error messages with ngx-toastr
- ✅ **Dashboard** - Overview of patient information
- ✅ **HIPAA Compliant** - Secure health information handling

## 🏗️ Architecture

### Technology Stack

- **Framework**: Angular 20
- **Authentication**: @azure/msal-angular, @azure/msal-browser
- **Notifications**: ngx-toastr
- **Styling**: SCSS with modern gradients
- **State Management**: Angular Signals

### Folder Structure

```
src/
├── auth.config.ts              # MSAL configuration
├── enviornments/               # Environment configs
├── app/
    ├── core/
    │   ├── guards/             # Route protection
    │   ├── services/           # Business logic
    │   └── interceptors/       # HTTP interceptors
    └── features/
        ├── auth/               # Login functionality
        └── dashboard/          # Dashboard page
```

## 🔐 Authentication Flow

1. User clicks "Sign in with Microsoft"
2. Redirects to Microsoft login page
3. User authenticates with Microsoft credentials
4. Microsoft redirects back with auth token
5. Exchange Azure token with backend API
6. Receive JWT tokens (access + refresh)
7. Store tokens and redirect to dashboard
8. Auth guard protects all secure routes
9. Auth interceptor adds JWT to API requests

## 📖 Documentation

For detailed setup and configuration, see [MSAL_SETUP.md](./MSAL_SETUP.md)

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
ng lint
```

### Key Components

- **Login Component** - Beautiful login page with Microsoft authentication
- **Dashboard Component** - Protected dashboard with patient information
- **Auth Guard** - Protects routes from unauthorized access
- **Auth Interceptor** - Adds JWT tokens to HTTP requests
- **Login Service** - Handles authentication logic

## 🎨 UI Design

The application features a modern, professional design with:

- **Gradient backgrounds** - Purple to pink gradients
- **Animated elements** - Smooth transitions and floating circles
- **Responsive layout** - Works on desktop and mobile
- **Microsoft branding** - Official colors and icons
- **Clean typography** - Modern, readable fonts
- **Toast notifications** - Non-intrusive error/success messages

## 🔒 Security

- **Azure AD Authentication** - Enterprise-grade security
- **JWT Tokens** - Secure API authentication
- **Route Guards** - Prevent unauthorized access
- **Token Validation** - Automatic expiration checking
- **HTTPS Ready** - Production-ready security
- **Error Handling** - No sensitive data in error messages

## 📦 Dependencies

### Core Dependencies

```json
{
  "@angular/common": "^20.1.0",
  "@angular/core": "^20.1.0",
  "@azure/msal-angular": "^4.0.0",
  "@azure/msal-browser": "^4.27.0",
  "ngx-toastr": "^19.0.0"
}
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

The build artifacts will be in the `dist/` directory.

### Environment Configuration

Create production environment file and update Azure AD redirect URIs.

See [MSAL_SETUP.md](./MSAL_SETUP.md#-production-deployment) for details.

## 🐛 Troubleshooting

### Common Issues

1. **Login redirect loop**
   - Check Azure AD redirect URI configuration
   - Verify `auth.config.ts` redirectUri matches

2. **Token exchange fails**
   - Confirm backend API URL is correct
   - Check backend `/validate-azure-token/` endpoint

3. **CORS errors**
   - Configure CORS on backend
   - Add frontend URL to allowed origins

4. **Auth guard not working**
   - Check localStorage for tokens
   - Verify token expiration logic

## 📞 Support

For detailed troubleshooting and setup instructions, refer to:
- [MSAL Setup Guide](./MSAL_SETUP.md)
- [Azure AD Documentation](https://docs.microsoft.com/azure/active-directory/)

## 📄 License

© 2024 Patient Portal. All rights reserved.

---

**Built with ❤️ using Angular and Microsoft Azure AD**
