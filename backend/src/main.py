from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.project import project_router
from routers.auth import auth_router
from routers.user import user_router
from routers.project_management import project_management_router
from routers.run import run_router
from routers.task import task_router
from routers.status import status_router
from routers.priority import priority_router
from database_init import initialize_database
import os

ALLOWED_ORIGIN: list = os.getenv("CORS_ALLOWED_ORIGIN", "http://localhost:8000").replace(" ", "").split(",")
ALLOWED_METHODS: list = os.getenv("CORS_ALLOWED_METHODS", "GET, POST, PUT, DELETE, PATCH").replace(" ", "").split(",")
ALLOWED_HEADERS: list = os.getenv("CORS_ALLOWED_HEADERS", "*").replace(" ", "").split(",")
ALLOW_CREDENTIALS: bool = os.getenv("CORS_ALLOW_CREDENTIALS", "TRUE") == "TRUE"
MAX_AGE: int = int(os.getenv("CORS_MAX_AGE", 600))


description = """
## Usage and explanation

1. Register user `[POST] /user`

2. Login user `[POST] /auth/token` (create token) and `[POST] /auth/refresh` (refresh token)

3. Create project `[POST] /project`

4. Get projects `[GET] /project`
"""

tags_metadata = [
    {
        "name": "Auth",
        "description": "Operations with authentication. **No authorization required.**",
    },
    {
        "name": "User",
        "description": "Operations with users. **No authorization required.**",
    },
    {
        "name": "Project",
        "description": "Operations with projects. **Authorization required.**",
    },
    {
        "name": "Project Management",
        "description": "Operations with project collaborators. **Authorization required.**",
    },
    {
        "name": "Run",
        "description": "Operations with project runs. **Authorization required.**",
    },
    {
        "name": "Task",
        "description": "Operations with project tasks. **Authorization required.**",
    },
    {
        "name": "Status",
        "description": "Operations with project statuses. **Authorization required.**",
    },
    {
        "name": "Priority",
        "description": "Operations with project priorities. **Authorization required.**",
    }
]

app = FastAPI(
    title="SWI APP",
    summary="SWI APP - Kanban board for software development teams.",
    description=description,
    version="0.0.1",
    openapi_tags=tags_metadata,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGIN,
    allow_credentials=ALLOW_CREDENTIALS,
    allow_methods=ALLOWED_METHODS,
    allow_headers=ALLOWED_HEADERS,
    max_age=MAX_AGE,
)

app.include_router(project_router)
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(project_management_router)
app.include_router(run_router)
app.include_router(task_router)
app.include_router(status_router)
app.include_router(priority_router)

initialize_database()
