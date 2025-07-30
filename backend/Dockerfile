# Use an official lightweight Python image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_VERSION=1.8.2

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl build-essential libpq-dev && \
    curl -sSL https://install.python-poetry.org | python3 - && \
    apt-get purge -y curl && \
    rm -rf /var/lib/apt/lists/*

# Add Poetry to PATH
ENV PATH="/root/.local/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy dependency files
COPY pyproject.toml poetry.lock ./

# Install Python dependencies
RUN poetry install --no-root --only main

# Copy the rest of the application
COPY . .

# Run the app (modify as per your entrypoint)
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]