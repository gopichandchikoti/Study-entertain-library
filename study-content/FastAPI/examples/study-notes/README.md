# Run the local Python example
Create .venv with Python 3.11+, then install requirements.txt in that virtual environment.
Run pytest and uvicorn app:app --host 127.0.0.1 --port 8000.
Open /docs. Send x-demo-user: student-a for synthetic ownership checks.

This teaching adapter uses one in-memory SQLite connection, lost on restart.
It is not production authentication or a concurrent repository design.
Add per-request connection ownership, authentication, bounded HTTP body middleware,
safe exception translation, migration and readiness tests before a hosted service.
