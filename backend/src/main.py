from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.project import project_router
from routers.auth import auth_router
from routers.user import user_router
from routers.project_management import project_management_router
from routers.sprint import sprint_router
from routers.task import task_router
from routers.priority import priority_router
from routers.tag import tag_router
from database_init import initialize_database
import os

ALLOWED_ORIGIN: list = os.getenv("CORS_ALLOWED_ORIGIN", "http://localhost:8000").replace(" ", "").split(",")
ALLOWED_METHODS: list = os.getenv("CORS_ALLOWED_METHODS", "GET, POST, PUT, DELETE, PATCH").replace(" ", "").split(",")
ALLOWED_HEADERS: list = os.getenv("CORS_ALLOWED_HEADERS", "*").replace(" ", "").split(",")
ALLOW_CREDENTIALS: bool = os.getenv("CORS_ALLOW_CREDENTIALS", "TRUE") == "TRUE"
MAX_AGE: int = int(os.getenv("CORS_MAX_AGE", 600))


description = """


## RENBoard

**RENBoard** is a Kanban board (with Scrum features) for software development teams. It allows you to manage your projects, sprints, tasks, and more.

### ⚙️ How to use

1. Register new user `[POST] /user`.

2. Login user `[POST] /auth/token` (create token) and `[POST] /auth/refresh` (refresh token).

    - You can use **Authorize button** to login into swagger.  **Only fields username and password are required.** It will automatically store and add token to auth requests.

3. Create a new project `[POST] /project`.

4. Create a new task `[POST] /task` to the project.

5. Create a new sprint `[POST] /sprint`, specify your columns and assing some tasks to it.

6. Move your tasks between columns `[POST] /task/{task_id}/assign`.

7. Manage your project collaborators `[POST] /project-management`.

🎉 Enjoy using **RENBoard**! 🎉
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
        "description": "Managing project collaborators. **Authorization required.**",
    },
    {
        "name": "Sprint",
        "description": "Operations with project sprints. **Authorization required.**",
    },
    {
        "name": "Task",
        "description": "Operations with project tasks. **Authorization required.**",
    },
    {
        "name": "Priority",
        "description": "Operations with task priorities. **Authorization required.**",
    },
    {
        "name": "Tag",
        "description": "Operations with project tags. **Authorization required.**",
    },
]

app = FastAPI(
    title="SWI APP",
    description=description,
    version="1.0.0",
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
app.include_router(sprint_router)
app.include_router(task_router)
app.include_router(priority_router)
app.include_router(tag_router)

initialize_database()
