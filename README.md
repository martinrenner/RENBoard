# RENBoard

## 📖 Description

RENBoard is a powerful Kanban board application enhanced with Scrum elements designed to streamline project management and boost team productivity. It provides an intuitive interface for managing tasks and visualizing project progress through various metrics and charts.

## 🗝️ Key Features

- **Interactive Board:** Create and organize cards on a Kanban board with seamless interactions.
- **Manage Your Project Tasks:** Utilize drag-and-drop capabilities to easily move tasks across different stages of your project.
- **Customizable Columns:** Adapt the board to fit the specific needs of your project by customizing column names and the number of columns.
- **Visualization:** Track project performance and milestones with detailed statistics including a Burndown chart and measurements of Project Velocity/Throughput.

## ⚙️ Technical Stack

- **Backend:** FastAPI - A modern, fast (high-performance) web framework for building APIs with Python.
- **Frontend:** React - A JavaScript library for building user interfaces, designed for creating rich and engaging web apps.
- **Database:** A powerful, object-relational database system that safely stores our application data.

- **Helper Tools:**
    - **Docker:** Simplify deployment and create a consistent environment for development and production.
    - **PgAdmin:** Web-based administration tool for PostgreSQL, facilitating database management.

## Installation guide

1. Clone the application repositary

 ```bash
   git clone https://github.com/martinrenner/SWI.git
```

2. Define environment variables

```bash
cp .env.example .env
```

- Fill `.env` file with your custom credentials.

3. Run the application using Docker

```bash
docker compose up
```

- The application should automatically initialize and become accessible after running `docker compose up`.

## 🚀 Usage

After installation, access the following services in your web browser:

- React Frontend: `http://localhost:5173`
- FastAPI Swagger Documentation: `http://localhost:8000/docs`
- PgAdmin Dashboard: `http://localhost:5050` (**optional** - it requires more setup)


### How to use

1. Register and log in to your account.
3. Create a new project.
4. Add tasks to your project.
5. Initiate a new sprint and assign tasks. You can add more tasks later.
6. Progress tasks across columns as you work on them.
7. Visualize your task progress with the Burndown chart.


## 👨🏿‍💻 Contributors
- [Martin Renner](https://github.com/martinrenner) - Creator and Main Contributor

## 🙌🏿 Acknowledgement

Thank you for choosing **RENBoard**. I hope this documentation helps you to implement agile methods effectively in your workflow. 

For any issues or questions, feel free to open an issue on the GitHub repository or contact the contributor.