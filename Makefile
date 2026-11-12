.PHONY: dev test lint migrate contract

dev:
	@echo "Starting backend and frontend..."
	@start cmd /k "cd backend && python manage.py runserver"
	@start cmd /k "cd frontend && npm run dev"
	@echo "Backend: http://localhost:8000  Frontend: http://localhost:5173"

test:
	cd backend && pytest
	cd frontend && npm test -- --run

lint:
	cd backend && ruff check .
	cd frontend && npm run lint

migrate:
	cd backend && python manage.py migrate

contract:
	cd backend && python manage.py spectacular --file ../openapi.yaml
	cd frontend && npx openapi-typescript ../openapi.yaml -o src/api/generated/api.d.ts
