from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.project import project_router
from routers.auth import auth_router
from routers.user import user_router
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
        "name": "Project",
        "description": "Operations with projects. Basic CRUD operations. **Authorization required.**",
    },
    {
        "name": "User",
        "description": "Operations with users. **No authorization required.**",
    },
    {
        "name": "Auth",
        "description": "Operations with authentication. **No authorization required.**",
    },
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

initialize_database()