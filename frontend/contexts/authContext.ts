import { createContext } from "react";

interface AuthContext {
    usuario: any;
    setUsuario: (usuario: any) => void;
}

export const AuthContext = createContext<AuthContext>({
    usuario: null,
    setUsuario: () => {}
});
