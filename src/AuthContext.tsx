import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
  } from "react";
  
  interface User {
    id: number; // Añade la propiedad id
    email: string;
    name: string;
  }
  
  interface AuthContextType {
    token: string | null;
    user: User | null;
    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
  }
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("authUser");
  
      if (storedToken) setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error al analizar el usuario almacenado:", error);
          setUser(null);
        }
      }
    }, []);
  
    useEffect(() => {
      if (token) {
        localStorage.setItem("authToken", token);
      } else {
        localStorage.removeItem("authToken");
      }
    }, [token]);
  
    useEffect(() => {
      if (user) {
        localStorage.setItem("authUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("authUser");
      }
    }, [user]);
  
    return (
      <AuthContext.Provider value={{ token, user, setToken, setUser }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
  };
  