import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import { Container } from "react-bootstrap";

function Layout() {
  return (
    <>
      <Header />
      <Container className="mt-5">
        <Outlet />
      </Container>
    </>
  );
}

export default Layout;
