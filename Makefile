.PHONY: help install start stop clean logs test

help:
	@echo "Number Discussion Application - Makefile Commands"
	@echo ""
	@echo "Usage:"
	@echo "  make install    - Install all dependencies"
	@echo "  make start      - Start the application with Docker Compose"
	@echo "  make stop       - Stop all services"
	@echo "  make logs       - View logs from all services"
	@echo "  make clean      - Stop and remove all containers and volumes"
	@echo "  make test       - Run backend tests"
	@echo ""

install:
	@echo "Installing backend dependencies..."
	cd backend && npm install
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "✓ All dependencies installed!"

start:
	@echo "Installing backend dependencies..."
	cd backend && npm install
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Starting application with Docker Compose..."
	docker-compose up --build -d
	@echo ""
	@echo "✓ Application started!"
	@echo ""
	@echo "Services:"
	@echo "  Frontend: http://localhost"
	@echo "  Backend:  http://localhost:3000"
	@echo ""
	@echo "Run 'make logs' to view logs"
	@echo "Run 'make stop' to stop services"

stop:
	@echo "Stopping all services..."
	docker-compose down
	@echo "✓ Services stopped"

clean:
	@echo "Stopping and removing all containers and volumes..."
	docker-compose down -v
	@echo "✓ Cleanup complete"

logs:
	docker-compose logs -f

test:
	@echo "Running backend tests in Docker..."
	docker exec number-discussion-backend sh -c "cd /app && npm test"

