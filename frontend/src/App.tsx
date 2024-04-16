import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ProjectEdit from "./components/Projects/EditProject/EditProject.tsx";
import ProjectView from "./components/Projects/ProjectView/ProjectView.tsx";
import ProjectCreate from "./components/Projects/CreateProject/CreateProject.tsx";
import ProjectList from "./components/Projects/ProjectList/ProjectList.tsx";
import Login from "./components/Login/Login.tsx";
import Register from "./components/Register/Register.tsx";
import TokenContextProvider from "./context/TokenContextProvider.tsx";
import Authenticated from "./components/Authenticated/Authenticated.tsx";
import Home from "./components/Home/Home.tsx";
import Layout from "./Layout.tsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <Home /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        {
          path: "projects/",
          children: [
            { path: "create", element: <Authenticated><ProjectCreate /></Authenticated> },
            { path: "", element: <Authenticated><ProjectList /></Authenticated> },
            { path: ":project_id", element: <Authenticated><ProjectView /></Authenticated> },
            { path: ":project_id/edit", element: <Authenticated><ProjectEdit /></Authenticated> },
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
