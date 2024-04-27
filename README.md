# RENBoard

## 📖 Description

RENBoard is a powerful Kanban board application enhanced with Scrum elements designed to streamline project management and boost team productivity. It provides an intuitive interface for managing tasks and visualizing project progress through various metrics and charts.

## 🗝️ Key Features

- **Interactive Board:** Create and organize cards on a Kanban board with seamless interactions.
- **Manage Your Project Tasks:** Utilize drag-and-drop capabilities to easily move tasks across different stages of your project.
- **Customizable Columns/Stages:** Adapt the board to fit the specific needs of your project by customizing column names and the number of columns.
- **Visualization:** Track project performance and milestones with detailed statistics including a Burndown chart and measurements of Project Velocity/Throughput.

## ⚙️ Technical Stack

- **Backend:** FastAPI - A modern, fast (high-performance) web framework for building APIs with Python.
- **Frontend:** React - A JavaScript library for building user interfaces, designed for creating rich and engaging web apps.
- **Database:** PostgreSQL - A powerful, object-relational database system that safely stores our application data.
- **Helper Tools:**
  - **Docker:** Simplifies deployment and creates a consistent environment for development and production.
  - **PgAdmin:** A web-based administration tool for PostgreSQL, facilitating database management.

## 🚀 Usage

This detailed usage guide will help you get started with RENBoard and make the most of its features for effective project management.

### Starting Up

- **Access the Application:**
  - After installation, open your web browser and navigate to `http://localhost:5173` to access the React frontend.
  - Visit `http://localhost:8000/docs` for the FastAPI Swagger documentation.

### Basic Operations

- **Register and Log In:**
  - Start by registering an account using the "Register" button on the homepage.
  - Once registered, log in to your account to access your personal dashboard.

- **Create a New Project:**
  - Click on the "+" button, enter the project details such as project name, description, customer, and tags.
  - Submit the form to create your project, which will then appear on your dashboard.
  - You can later edit, add members to, and delete this project.

- **Create New Tasks for Your Project:**
  - Navigate to your project by clicking on it in the dashboard.
  - Click on the "+" button in the tasks section, fill in the task details, and submit to add the task to the project.

- **Initiate a New Sprint:**
  - Within a project, go to the "Sprints" section and click "+".
  - Define sprint details such as its duration. Then select the tasks you want to include in the sprint and set the required columns/stages in the order they will be used.

- **Manage Task Progress:**
  - Drag and drop tasks across different columns (e.g., To Do, In Progress, Done) as you work on them.
  - View, update, deassign, and delete tasks by clicking on the button on task card.

### Managing Project Collaborators

- **Manage Project Collaborators:**
  - As the owner of a project, you can invite new collaborators by sending them an invitation through the project's management tab.
  - Collaborators must accept the invitation to join your team.
  - Owners also have the ability to remove collaborators from the project at any time.

### Monitoring and Reporting

- **Visualize Progress:**
  - Access the Burndown chart on the sprint page.
  - Monitor overall project velocity and task throughput on the project statistics page.

### Tips for Efficient Use

- **Regular Updates:** Regularly update task statuses and sprint progress to keep the team informed.

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

4. After installation, access the following services in your web browser:

- React Frontend: `http://localhost:5173`
- FastAPI Swagger Documentation: `http://localhost:8000/docs`
- PgAdmin Dashboard: `http://localhost:5050` (**optional** - requires more setup)

## 👨🏿‍💻 Contributors
- [Martin Renner](https://github.com/martinrenner) - Creator and Main Contributor

## 📧 Contact

If you have any questions or feedback, please don't hesitate to reach out via martin@martinrenner.cz.

## 🙌🏿 Acknowledgement

Thank you for choosing **RENBoard**. I hope this documentation helps you to implement this board effectively in your workflow. For any issues or questions, feel free to open an issue on the GitHub repository or contact the contributor on email written above.