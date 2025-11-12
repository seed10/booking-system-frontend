# Branch Appointment Booking System - Frontend

Frontend microservice for the branch appointment booking system built with Angular 20 and Material UI.

## Technology Stack

- **Angular 20** - Modern web application framework
- **Angular Material** - Material Design UI components
- **TypeScript** - Type-safe JavaScript
- **RxJS** - Reactive programming library
- **Nginx** - Web server for production deployment

## Features

- **No Login Required** - Seamless user experience without authentication
- **Language switcher** - Change to English, Afrikaans, Zulu, Xhosa
- **Reactive Forms** - Form validation with real-time feedback
- **Material Design** - Professional UI with Angular Material components
- **Toast Notifications** - Instant feedback on booking success/failure
- **Responsive Design** - Works on desktop and mobile devices
- **Custom Styling** - Branded color scheme (#0033a0, #2f70ef)

## Prerequisites

- **Node.js 20** or higher
- **npm** or **yarn**
- **Docker** (optional, for containerized deployment)

## Getting Started

### Option 1: Run with Docker Compose

```bash
docker-compose up --build
```

The frontend will be available at http://localhost:4200

### Option 2: Run Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

   The application will be available at http://localhost:4200

## Development

### Development Server
```bash
npm start
# or
ng serve
```

Navigate to http://localhost:4200. The app will automatically reload when you change source files.

### Build
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Running Tests
```bash
npm test
```

### Running Tests with Coverage
```bash
npm test -- --code-coverage
```

## Configuration

The frontend connects to the backend API. Update the API URL in:
`src/app/services/appointment.service.ts`

```typescript
private apiUrl = 'http://localhost:8080/api/appointments';
```

For production, use environment files or build-time configuration.

## Design System

### Color Palette

- **Primary Heading**: `#0033a0` (Dark Blue)
- **Primary Buttons**: `#2f70ef` (Blue)
- **Secondary Buttons**: White background with `#2f70ef` border

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── booking-form/
│   │       ├── booking-form.component.ts
│   │       ├── booking-form.component.html
│   │       └── booking-form.component.css
│   ├── models/
│   │   └── appointment.model.ts
│   ├── services/
│   │   └── appointment.service.ts
│   ├── app.component.ts
│   └── app.config.ts
├── assets/
├── index.html
├── main.ts
└── styles.css
```

## Docker

### Build Image
```bash
docker build -t booking-frontend .
```

### Run Container
```bash
docker run -p 4200:80 booking-frontend
```

## Environment Variables

When running in Docker, you can override the API URL:
- `API_URL` - Backend API URL (default: http://localhost:8080)

## Nginx Configuration

The production build uses Nginx with:
- Gzip compression
- SPA routing support (all routes redirect to index.html)
- Static asset caching

Configuration file: `nginx.conf`

## Building for Production

```bash
npm run build
```

The optimized production build will be in `dist/booking-system/browser/`

## Available Time Slots

The system provides time slots from 9:00 AM to 5:00 PM in 30-minute intervals:
- 09:00, 09:30, 10:00, ..., 17:00

## Form Validation

- **First Name**: Required, minimum 2 characters
- **Last Name**: Required, minimum 2 characters  
- **Service Type**: Required
- **Branch**: Required
- **Appointment Date**: Required, cannot be in the past
- **Appointment Time**: Required

---

Part of the Branch Appointment Booking System
- Backend Repository: [booking-system-backend](https://github.com/seed10/booking-system-backend)
