# Keycloak SSO Sample Application

A modern React application with Keycloak Single Sign-On (SSO) integration using Docker Compose.

## Features

- 🔐 **Keycloak SSO Integration** - Secure authentication with industry-standard identity provider
- 🎨 **Beautiful UI** - Modern, responsive design with Tailwind CSS
- 🐳 **Docker Compose Setup** - Easy deployment with all services containerized
- 🔒 **Protected Routes** - Secure dashboard accessible only to authenticated users
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🚀 **Production Ready** - Built with TypeScript and modern React patterns

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)

### 1. Start the Services

```bash
# Start all services (Keycloak, PostgreSQL, and the sample app)
docker-compose up -d

# Or start only Keycloak and database for local development
docker-compose up -d keycloak keycloak-db
```

### 2. Configure Keycloak

1. Open Keycloak Admin Console: http://localhost:8080
2. Login with:
   - Username: `admin`
   - Password: `admin123`

3. Create a new realm:
   - Click "Create Realm"
   - Name: `sample-realm`
   - Click "Create"

4. Create a client:
   - Go to "Clients" → "Create client"
   - Client ID: `sample-app`
   - Client type: `OpenID Connect`
   - Click "Next"
   - Configure:
     - Client authentication: `Off` (public client)
     - Standard flow: `Enabled`
     - Direct access grants: `Enabled`
   - Click "Next" → "Save"

5. Configure client settings:
   - Valid redirect URIs: `http://localhost:3000/*`
   - Valid post logout redirect URIs: `http://localhost:3000/*`
   - Web origins: `http://localhost:3000`
   - Click "Save"

6. Create a test user:
   - Go to "Users" → "Add user"
   - Fill in user details
   - Click "Create"
   - Go to "Credentials" tab
   - Set password (temporary: off)
   - Click "Set password"

### 3. Run the Application

#### Using Docker (recommended)
```bash
# Build and run all services
docker-compose up --build
```

#### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application

- **Sample Application**: http://localhost:3000
- **Keycloak Admin**: http://localhost:8080

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │    Keycloak     │    │   PostgreSQL    │
│   (Port 3000)   │◄──►│   (Port 8080)   │◄──►│   (Port 5432)   │
│                 │    │                 │    │                 │
│ - Login Page    │    │ - Authentication│    │ - Keycloak DB   │
│ - Dashboard     │    │ - User Management│   │ - User Storage  │
│ - SSO Flow      │    │ - Token Service │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Configuration Files

### Keycloak Configuration
- **Realm**: `sample-realm`
- **Client ID**: `sample-app`
- **Client Type**: Public (SPA)
- **Authentication Flow**: Authorization Code with PKCE

### Environment Variables
- `KC_DB`: postgres
- `KC_HOSTNAME`: localhost
- `KEYCLOAK_ADMIN`: admin
- `KEYCLOAK_ADMIN_PASSWORD`: admin123

## Development

### Local Development Setup
```bash
# Start only Keycloak services
docker-compose up -d keycloak keycloak-db

# Install dependencies
npm install

# Start React development server
npm run dev
```

### Building for Production
```bash
# Build the React application
npm run build

# Build and run with Docker
docker-compose up --build
```

## Security Features

- **PKCE (Proof Key for Code Exchange)** - Enhanced security for SPAs
- **Token Refresh** - Automatic token renewal
- **Silent Check SSO** - Seamless authentication checks
- **Secure Logout** - Proper session termination
- **Protected Routes** - Access control based on authentication state

## Troubleshooting

### Common Issues

1. **Keycloak not accessible**
   - Wait for services to fully start (can take 1-2 minutes)
   - Check logs: `docker-compose logs keycloak`

2. **Authentication fails**
   - Verify realm and client configuration
   - Check redirect URIs match exactly
   - Ensure user has been created and activated

3. **Database connection issues**
   - Ensure PostgreSQL is running: `docker-compose logs keycloak-db`
   - Check network connectivity between services

### Logs
```bash
# View all service logs
docker-compose logs

# View specific service logs
docker-compose logs keycloak
docker-compose logs sample-app
```

## Production Deployment

For production deployment:

1. **Change default passwords**
2. **Use proper domain names**
3. **Enable HTTPS**
4. **Configure proper CORS settings**
5. **Set up proper database backups**
6. **Monitor and log activities**

## License

MIT License - feel free to use this for your projects!