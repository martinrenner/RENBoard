import React from "react";

interface TokenContextType {
    username: string | null | undefined;
    token: string | null | undefined;
    login: (newToken: string) => void,
    logout: () => void,
    isTokenValid: () => boolean,
}

const TokenContext = React.createContext({} as TokenContextType);

export default TokenContext;
