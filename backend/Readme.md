# Backend Application

A FastAPI-based backend application with PostgreSQL database integration, containerized using Docker and managed with Poetry for dependency management.

## 🚀 Features

- **FastAPI**: Modern, fast web framework for building APIs
- **PostgreSQL**: Robust relational database with async support
- **Poetry**: Dependency management and packaging
- **Docker**: Containerized deployment
- **Alembic**: Database migrations
- **Async Support**: Full async/await support with asyncpg

## 📋 Prerequisites

- Docker and Docker Compose
- Python 3.11+ (for local development)
- Poetry (for local development)

## 🛠️ Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the root directory:

```env
SECRET_KEY="your-secret-key-here"
DATABASE_URL="postgresql+asyncpg://postgres:postgres@db:5432/app_db"
```

**Note**: Update the `SECRET_KEY`, `DATABASE_URL` with a secure, randomly generated key for production and use async in env with postgress databse.

### 2. Database Migration Setup

Configure Alembic for database migrations:

1. Update the database URL in `alembic.ini`  without asyncpg :
   ```ini
   sqlalchemy.url = postgresql://postgres:postgres@db:5432/app_db
   ```

2. Generate initial migration (if not already done):
   ```bash
   poetry run alembic revision --autogenerate -m "Initial migration"
   ```

3. Apply migrations:
   ```bash
   poetry run alembic upgrade head
   ```

### 3. Docker Setup

The application includes a Dockerfile with the following features:
- Python 3.11 slim base image
- Poetry for dependency management
- Optimized for production with minimal dependencies
- PostgreSQL client libraries included

Build and run with Docker:

```bash
# Build the image
docker build -t backend-app .

# Run the container
docker run -p 8000:8000 --env-file .env backend-app
```

## 🔧 Local Development

### Installation

1. Install Poetry:
   ```bash
   curl -sSL https://install.python-poetry.org | python3 -
   ```

2. Install dependencies:
   ```bash
   poetry install
   ```

3. Activate virtual environment:
   ```bash
   poetry shell
   ```

### Running Locally

1. Start PostgreSQL (ensure it's running on localhost:5432)

2. Update `.env` for local development:
   ```env
   DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/app_db"
   ```

3. Run migrations:
   ```bash
   poetry run alembic upgrade head
   ```

4. Start the development server:
   ```bash
   poetry run uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

Once the application is running, access the interactive API documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🗃️ Database Management

### Creating Migrations

When you modify database models:

```bash
# Generate migration
poetry run alembic revision --autogenerate -m "Description of changes"

# Apply migration
poetry run alembic upgrade head
```

### Migration Commands

```bash
# View current migration status
poetry run alembic current

# View migration history
poetry run alembic history

# Rollback to previous migration
poetry run alembic downgrade -1

# Rollback to specific revision
poetry run alembic downgrade <revision_id>
```

## 🔒 Security Notes

- Always use strong, unique `SECRET_KEY` values
- Update default database credentials in production
- Use environment-specific `.env` files
- Never commit sensitive credentials to version control

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI application entry point
│   ├── models/          # Database models
│   ├── routers/         # API route handlers
│   ├── services/        # Business logic
│   └── schemas/         # Schemas functions
├── alembic/             # Database migrations
├── .env                 # Environment variables
├── .env.example         # Environment template
├── alembic.ini          # Alembic configuration
├── Dockerfile           # Docker configuration
├── poetry.lock          # Locked dependencies
├── pyproject.toml       # Project configuration
└── README.md           # This file
```



### Production Considerations

1. Update environment variables for production
2. Use a production-grade WSGI server (already configured with uvicorn)
3. Set up proper logging and monitoring
4. Configure database connection pooling
5. Implement proper backup strategies

### Environment Variables

Required environment variables:
- `SECRET_KEY`: Application secret key
- `DATABASE_URL`: PostgreSQL connection string
- `ENVIRONMENT`: Set to "production" for production deployments

## 📞 Support

For issues and questions:
1. Check the API documentation at `/docs`
2. Review application logs
3. Ensure all environment variables are properly configured
4. Verify database connectivity
