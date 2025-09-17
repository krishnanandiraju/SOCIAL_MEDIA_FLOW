
# Backend — FastAPI + MongoDB

## Quick start
1) Create a virtual env and install deps
   ```bash
   cd backend
   python -m venv .venv && source .venv/bin/activate  # (Windows: .venv\Scripts\activate)
   pip install -r requirements.txt
   ```
2) Start MongoDB (Docker recommended)
   ```bash
   docker compose up -d mongo
   ```
3) Configure environment (copy `.env.example` → `.env`) and edit values if needed.
4) Run the API
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

## API docs
- Swagger UI: http://localhost:8000/docs
- OpenAPI JSON: http://localhost:8000/openapi.json
