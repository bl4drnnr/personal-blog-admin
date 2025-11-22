# Personal Blog Admin Panel

A comprehensive Angular-based content management system for managing a personal blog and portfolio website. This admin panel provides a full-featured interface for content creation, user management, security configuration, and site customization.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Security Features](#security-features)
- [Available Scripts](#available-scripts)
- [Code Quality](#code-quality)
- [Architecture Patterns](#architecture-patterns)

## Overview

This admin panel serves as the control center for a personal blog and portfolio website. It provides administrators with tools to manage articles, projects, static pages, assets, user communications, and site-wide settings through an intuitive web interface.

The application is built with Angular 17 and follows modern best practices for component architecture, state management, and API integration. It features comprehensive security measures including multi-factor authentication, account recovery systems, and token-based session management.

## Key Features

### Content Management

**Blog Articles**
- Create, edit, and delete blog posts with rich HTML editor
- Publish and unpublish articles
- Mark articles as featured
- Slug-based URL management
- Search, filter, and pagination support
- Table insertion and editing within content

**Projects Portfolio**
- Manage project showcases with descriptions and images
- Featured project highlighting
- Publish/draft status control
- Image and metadata management

**Static Assets**
- Upload files and base64-encoded images
- Asset categorization (icons, project pictures, article pictures, static assets)
- AWS S3 integration for storage
- Search and pagination functionality

### Page Management

Manage content for multiple static pages:
- Home Page landing content
- Blog listing page settings
- Projects portfolio page
- Contact form page
- FAQ page
- Newsletter subscription page
- Custom sections

### About and Profile Section

**About Page**
- Personal biography and information management

**Work Experience**
- Company experience entries
- Multiple positions per company
- Timeline and duration tracking

**Certifications**
- Professional certifications with PDF support
- Selection status for public display
- Certificate file management

### Legal and Documentation

- **Changelog**: Version history with detailed entries
- **License**: License information with tile-based display
- **Privacy Policy**: Privacy sections and settings management
- **Copyright**: Copyright information and year tracking
- **Custom 404 Page**: Not Found page content customization

### Communication Management

**Contact Messages**
- View messages from website contact form
- Reply to user inquiries
- Mark messages as read/unread
- Delete messages
- Message filtering and search

**Newsletter Subscriptions**
- View email subscribers
- Manage subscription list
- Export subscriber data

### Site Configuration

**General Settings**
- Site name, description, and author information
- Default images for social sharing
- SEO keywords and meta descriptions
- Social media profile links (LinkedIn, GitHub)
- Organization details

**Advanced Controls**
- Maintenance mode toggle
- Temporary password protection
- Deployment trigger from dashboard
- Navigation menu management
- Social links configuration

## Technology Stack

### Core Framework
- **Angular**: 17.3.0
- **TypeScript**: 5.4.2
- **RxJS**: 7.8.0

### UI and User Experience
- **ngx-editor**: 17.5.4 - Rich text HTML editor
- **ngx-lottie**: 11.0.2 - Animation support
- **ng2-pdf-viewer**: 10.3.1 - PDF viewing capabilities
- **Styling**: SCSS with component-scoped styles

### Utilities
- **dayjs**: 1.11.11 - Date manipulation and formatting
- **file-saver**: 2.0.5 - Client-side file downloads

### Development Tools
- **Angular CLI**: 17.3.4
- **ESLint**: 8.57.0 with TypeScript support
- **Prettier**: 3.2.5 - Code formatting
- **Jasmine & Karma**: Testing framework
- **PM2**: Production process management

### Cloud Services
- **AWS S3**: Static asset storage (eu-central-1 region)

## Prerequisites

Before installing and running this application, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Angular CLI**: Version 17.x (installed globally)
- **Git**: For version control

To install Angular CLI globally:

```bash
npm install -g @angular/cli@17
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd personal-blog-admin
```

2. Install dependencies:

```bash
npm install
```

3. Verify installation:

```bash
ng version
```

## Configuration

### Environment Configuration

The application uses environment files for configuration management:

- `src/environments/environment.ts` - Development environment
- `src/environments/environment.production.ts` - Production environment

Key configuration items:
- API base URL
- Basic authentication credentials for API gateway
- AWS S3 storage endpoint
- Feature flags

### API Configuration

Update the API base URL in environment files:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4201/api',
  // Other configuration...
};
```

### TypeScript Path Aliases

The project uses path aliases configured in `tsconfig.json` for cleaner imports:

- `@components/*` -> `src/app/components/*`
- `@pages/*` -> `src/app/pages/*`
- `@shared/*` -> `src/app/shared/*`
- `@services/*` -> `src/app/shared/services/*`
- `@interfaces/*` -> `src/libs/interfaces/*`
- `@payloads/*` -> `src/libs/api/payloads/*`
- `@responses/*` -> `src/libs/api/responses/*`

## Development

### Starting the Development Server

Start the development server on http://localhost:4200:

```bash
npm start
```

Or use Angular CLI directly:

```bash
ng serve
```

### Running with Production Configuration

To run the development server with production environment settings:

```bash
npm run prod
```

This uses production environment variables while running in development mode.

### Hot Module Replacement

The development server includes hot module replacement for instant updates during development.

### Development Workflow

1. Start the development server
2. Make changes to components, services, or templates
3. View changes automatically in the browser
4. Use browser DevTools for debugging
5. Run linting and formatting before committing

## Building for Production

### Production Build

Create an optimized production build:

```bash
npm run admin:build
```

This command runs:
```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory with the following optimizations:
- Ahead-of-Time (AOT) compilation
- Tree-shaking for smaller bundle size
- Minification and uglification
- Source maps generation
- CSS optimization
- Asset optimization

### Build Output

The production build generates:
- Optimized JavaScript bundles
- Compiled CSS files
- Optimized assets and images
- Index.html with proper base href
- Service worker files (if configured)

### Build Configuration

Build settings are configured in `angular.json` under the production configuration. Key optimizations include:
- Budget limits for bundle sizes
- Output hashing for cache busting
- Asset optimization
- Build optimization flags

## Deployment

### PM2 Process Management

The application uses PM2 for production process management.

**Start the production server:**
```bash
npm run admin:process-start
```

**Restart the application:**
```bash
npm run admin:restart
```

### PM2 Commands

After starting with PM2, you can use standard PM2 commands:

```bash
pm2 list                    # List all processes
pm2 logs personal-blog-admin # View logs
pm2 stop personal-blog-admin # Stop the process
pm2 delete personal-blog-admin # Remove from PM2
```

### Deployment Workflow

1. Build the production version:
   ```bash
   npm run admin:build
   ```

2. Deploy build artifacts to your hosting server

3. Start with PM2:
   ```bash
   npm run admin:process-start
   ```

4. For updates, restart the process:
   ```bash
   npm run admin:restart
   ```

### In-App Deployment Trigger

The admin panel includes a deployment trigger feature accessible from the dashboard that integrates with external deployment services.

## Project Structure

```
personal-blog-admin/
   src/
      app/
         components/           # Reusable UI components
            basic-components/ # Core UI toolkit (17 components)
               button/
               input/
               dropdown/
               html-editor/
               asset-selector/
               input-mfa/
               qr-mfa/
               ...
            layout-components/ # Layout elements
                header/
                sidebar/
                loader/
                global-message/
         pages/                # Feature pages/modules
            admin/            # Admin dashboard and features
            credentials/      # Authentication pages
            dashboard/        # Main dashboard
            security/         # Security settings
            users/            # User management
         layouts/              # Page layout templates
         services/             # Core services
         shared/               # Shared utilities and services
            api/              # API integration layer
            services/         # Domain services (23 services)
            pipes/            # Custom Angular pipes
         interceptors/         # HTTP interceptors
            auth.interceptor.ts # Token injection
         app.component.ts      # Root component
         app.routes.ts         # Routing configuration
      libs/                     # Shared libraries
         api/                  # API type definitions
            controllers/      # API controller enums
            endpoints/        # Endpoint definitions (29 files)
            payloads/         # Request payload interfaces
            responses/        # Response type interfaces
         interfaces/           # Shared TypeScript interfaces
         styles/               # Global SCSS variables and mixins
      environments/             # Environment configurations
      assets/                   # Static assets
      index.html                # Application entry point
      main.ts                   # Application bootstrap
      styles.scss               # Global styles
   angular.json                  # Angular CLI configuration
   tsconfig.json                 # TypeScript configuration
   package.json                  # Dependencies and scripts
   .eslintrc.js                  # ESLint configuration
   .prettierrc                   # Prettier configuration
   README.md                     # This file
```

### Key Directories

**components/**: Contains all reusable UI components divided into basic components (buttons, inputs, editors) and layout components (header, sidebar, loader).

**pages/**: Feature modules representing different sections of the admin panel, each with its own routing and components.

**shared/services/**: Domain-specific services (23 services) handling business logic for articles, projects, assets, authentication, and more.

**libs/api/**: Complete API integration layer with type-safe definitions for all endpoints, payloads, and responses.

**interceptors/**: HTTP interceptors for cross-cutting concerns like authentication token injection.

## API Integration

### Architecture Pattern

The application uses a centralized API proxy pattern for all HTTP requests:

```typescript
ApiService.apiProxyRequest({
  controller: Controller.ARTICLES,
  action: ArticlesEndpoint.LIST,
  method: Method.GET,
  payload: { /* request body */ },
  params: { /* query parameters */ }
})
```

### API Controllers

The system integrates with 28 API controllers:

- **AUTH**: Authentication and authorization
- **RECOVERY**: Account recovery operations
- **SECURITY**: Two-factor authentication
- **USERS**: User profile management
- **ARTICLES**: Blog article operations
- **PROJECTS**: Project portfolio management
- **AUTHORS**: Author profile management
- **CATEGORIES**: Content categorization
- **ABOUT**: About page content
- **CERTIFICATIONS**: Professional certifications
- **EXPERIENCE**: Work experience entries
- **CHANGELOG**: Version history
- **LICENSE**: License information
- **PRIVACY**: Privacy policy content
- **MENU**: Navigation menu management
- **STATIC_ASSETS**: File and image uploads
- **SITE_CONFIG**: Global site settings
- **PAGES**: Static page content management
- **FAQ**: Frequently asked questions
- **CONTACT**: Contact form messages
- **NEWSLETTERS**: Email subscriptions
- **MAINTENANCE**: Maintenance mode control
- **PASSWORD_PROTECTION**: Site password protection
- **CONTROL**: Deployment controls
- **NOT_FOUND**: 404 page content
- **SOCIAL_LINKS**: Social media links
- **COPYRIGHT**: Copyright information
- **WHYS_SECTION**: Custom content sections

### Endpoint Organization

API endpoints are organized into 29 files with over 200 total endpoints covering:
- CRUD operations for all content types
- Authentication flows
- Security operations
- Asset management
- Communication handling
- Site configuration
- Deployment control

### Request Configuration

**Base URL**:
- Development: `http://localhost:4201/api`
- Production: Same origin (empty string)

**Authentication**:
- Basic authentication for API gateway
- Bearer token authentication (X-Access-Token header)
- Automatic token injection via interceptor
- Token storage in localStorage

**Error Handling**:
- Centralized error handling service
- Global message notifications
- Automatic loader state management
- Token refresh on authentication errors

## Security Features

### Multi-Factor Authentication (2FA)

**Setup Process**:
1. Generate QR code during registration or from security settings
2. Scan QR code with authenticator app (Google Authenticator, Authy, etc.)
3. Verify 6-digit code to enable 2FA
4. 2FA required for all future logins

**Login with 2FA**:
1. Enter email and password
2. Enter 6-digit code from authenticator app
3. Option to use recovery key if device unavailable
4. Time-based one-time password (TOTP) validation

**Components**:
- `input-mfa`: Specialized 6-digit code input with auto-focus and auto-submit
- `qr-mfa`: QR code display component with Lottie animations
- Resend code functionality with 120-second cooldown timer

### Account Recovery

**Recovery Keys**:
- Generated during registration and login flows
- One-time use keys for account access
- Downloadable key file for safe storage
- Recovery process bypasses 2FA requirement

**Password Recovery**:
- Forgot password flow with email verification
- Secure password reset tokens
- Password strength validation
- Confirmation matching

### Session Management

**Token-Based Authentication**:
- JWT-based access tokens
- Automatic token refresh mechanism
- Token storage in localStorage (`_at` key)
- Session validation on all protected routes

**Security Settings Page**:
- View last password change date
- Current session information (device, location)
- Enable/disable 2FA toggle
- Password strength indicator
- Recovery key generation

### Password Security

**Password Requirements**:
- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- At least one special character

**Password Strength Indicator**:
- Weak: Basic requirements met
- Medium: Good character variety
- Strong: Excellent security practices

### Access Control

**Authentication Interceptor**:
- Automatically adds Bearer token to all API requests
- Handles token expiration
- Redirects to login on authentication failure

**Base Admin Component**:
- All admin pages extend BaseAdminComponent
- Automatic user authentication check
- Session validation on component initialization
- Consistent auth behavior across application

**Route Protection**:
- Protected routes require valid authentication
- Automatic redirect to login for unauthenticated users
- Role-based access control (if implemented)

## Available Scripts

### Development
- `npm start` - Start development server on http://localhost:4200
- `npm run prod` - Start development server with production configuration
- `ng serve` - Alternative way to start development server

### Building
- `npm run admin:build` - Create production build in dist/ directory
- `ng build` - Create development build
- `npm run watch` - Build with watch mode for continuous compilation

### Testing
- `npm test` - Run unit tests with Karma
- `ng test` - Alternative way to run tests

### Code Quality
- `npm run format` - Format code with Prettier and fix ESLint issues
- `ng lint` - Run ESLint checks only

### Production Management
- `npm run admin:process-start` - Start application with PM2
- `npm run admin:restart` - Restart PM2 process

### Angular CLI
- `npm run ng` - Access Angular CLI commands
- `ng generate component <name>` - Generate new component
- `ng generate service <name>` - Generate new service
- `ng generate module <name>` - Generate new module

## Code Quality

### Linting

The project uses ESLint with TypeScript support for code quality enforcement:

```bash
npm run format
```

This command:
1. Formats all TypeScript files with Prettier
2. Runs ESLint with automatic fixing

**ESLint Configuration** (`.eslintrc.js`):
- TypeScript-specific rules
- Prettier integration for consistent formatting
- Custom rule configurations

### Formatting

**Prettier Configuration** (`.prettierrc`):
- Consistent code style
- Automatic formatting on save (if configured in IDE)
- Integrated with ESLint

### Editor Configuration

**EditorConfig** (`.editorconfig`):
- Consistent coding styles across different editors
- Indentation, line endings, and charset settings

### Best Practices

The codebase follows these best practices:
- Strong typing with TypeScript
- Component-based architecture
- Service layer for business logic
- Reactive programming with RxJS
- Consistent naming conventions
- Path aliases for clean imports
- SCSS modules for scoped styling

## Architecture Patterns

### Service-Based State Management

The application uses a service-based approach rather than complex state management libraries:

- **Domain Services**: Each feature has dedicated service (23 total)
- **RxJS Observables**: Reactive data streams throughout
- **Component State**: Local state management in components
- **Shared Services**: Global concerns (loader, messages, auth)
- **No Global Store**: Simplified architecture without Redux/NgRx

### Base Component Pattern

```typescript
export abstract class BaseAdminComponent {
  // Automatic user authentication
  // Session validation
  // Consistent initialization logic
}
```

All admin pages extend BaseAdminComponent for consistent behavior.

### Centralized API Integration

Single ApiService handles all HTTP communication:
- Type-safe request configuration
- Enum-driven controller and endpoint selection
- Consistent error handling
- Automatic loader management
- Token injection via interceptor

### Component Architecture

**Basic Components**: Reusable UI elements with `ControlValueAccessor` for form integration

**Layout Components**: Application shell elements (header, sidebar, loader)

**Page Components**: Feature-specific smart components with routing

**Service Layer**: Business logic separated from presentation

### Enum-Driven Configuration

All API configuration uses TypeScript enums:
- Controllers
- Endpoints
- HTTP methods
- Response status codes

Benefits:
- Type safety
- Autocomplete in IDE
- Single source of truth
- Refactoring support

### SCSS Architecture

- **Component Styles**: Scoped to components
- **Shared Variables**: Global color palette, spacing, typography
- **Admin Mixins**: Reusable style patterns for admin pages
- **Theme Support**: Consistent design system

### Custom Form Controls

Components implement `ControlValueAccessor` for seamless Angular Forms integration:
- `asset-selector`: Asset picker with search
- Custom validation
- Two-way data binding
- Reactive and template-driven form support

---

## Support and Contribution

For issues, questions, or contributions, please refer to the project repository or contact the maintainer.

## License

This project is private and proprietary. All rights reserved.
