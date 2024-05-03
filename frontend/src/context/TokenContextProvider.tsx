import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import TokenContext from "./TokenContext";

interface TokenContextProviderProps {
  children: React.ReactNode;
}

const TokenContextProvider = ({ children }: TokenContextProviderProps) => {
  const [token, setToken] = useState<string | null>();
  const [username, setUsername] = useState<string | null>();
  const [id, setId] = useState<number | null>();

  const login = (newToken: string) => {
    setToken(newToken);
    const decodedToken: { sub: string, id: number } = jwtDecode(newToken);
    setUsername(decodedToken.sub);
    setId(decodedToken.id);
  };

  const logout = () => {
    setToken(null);
  };

  const isTokenValid = () => {
    try {
      const decodedToken = token ? jwtDecode(token) : null;
      if (decodedToken && decodedToken.exp) {
        const currentTime = Date.now() / 1000;
        return decodedToken.exp > currentTime;
      }
    } catch (error) {
      logout();
    }
    return false;
  };

  return (
    <TokenContext.Provider value={{id, username, token, login, logout, isTokenValid }}>
      {children}
    </TokenContext.Provider>
  );
};

export default TokenContextProvider;
