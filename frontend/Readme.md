# Next.js Frontend Application

A modern Next.js frontend application with PostHog analytics integration, containerized using Docker for easy deployment and development.

## 🚀 Features

- **Next.js 14+**: React framework with server-side rendering and static generation
- **PostHog Analytics**: User analytics and feature flags integration
- **Docker Support**: Containerized deployment
- **Production Ready**: Optimized build configuration
- **TypeScript Support**: (if applicable)

## 📋 Prerequisites

- Node.js 20+ (for local development)
- Docker and Docker Compose (for containerized deployment)
- npm or yarn package manager

## 🛠️ Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the root directory for local development:

```env
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**Important**: 
- Replace `your_posthog_project_key_here` with your actual PostHog project key
- Update the PostHog host URL if using a self-hosted instance
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser

### 2. Local Development Setup

#### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

#### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The page will auto-reload when you make changes to the code.

### 3. Docker Setup

#### Building the Docker Image

```bash
docker build -t nextjs-frontend .
```