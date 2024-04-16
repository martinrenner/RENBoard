import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TokenContext from "../../context/TokenContext";

function Authenticated({ children }: { children: React.ReactNode }) {
  const { isTokenValid, logout } = useContext(TokenContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isTokenValid()) {
      logout();
      navigate("/login", { replace: true });
    }
  }, [isTokenValid, logout, navigate]);

  return <>{children}</>;
}

export default Authenticated;
