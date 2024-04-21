import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ProjectView from "./components/Projects/ViewProject/ProjectView.tsx";
import Login from "./components/Login/Login.tsx";
import Register from "./components/Register/Register.tsx";
import TokenContextProvider from "./context/TokenContextProvider.tsx";
import Authenticated from "./components/Authenticated/Authenticated.tsx";
import Home from "./components/Home/Home.tsx";
import Layout from "./Layout.tsx";
import Help from "./components/Help/Help.tsx";
import ListManageProjects from "./components/ManageProjects/ListManageProjects.tsx";
import ViewSprint from "./components/Sprints/ViewSprint/ViewSprint.tsx";
import ListProject from "./components/Projects/ListProject/ProjectList.tsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <Home /> },
        { path: "help", element: <Help />},
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        {
          path: "projects/",
          children: [
            { path: "", element: <Authenticated><ListProject /></Authenticated> },
            { path: ":project_id", element: <Authenticated><ProjectView /></Authenticated> },
          ],
        },
        {
          path: "project-magement/",
          element: <Authenticated><ListManageProjects /></Authenticated>,
        },
        {
          path: "sprint/",
          children: [
            { path: ":sprint_id", element: <Authenticated><ViewSprint /></Authenticated> },
          ],
        },
        { path: "*", element: <div>Not Found</div> },
      ],
    },
  ]);


  return (
    <>
      <TokenContextProvider>
        <RouterProvider router={router} />
      </TokenContextProvider>
    </>
  );
}

export default App;
