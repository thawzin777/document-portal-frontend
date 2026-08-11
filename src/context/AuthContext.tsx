import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

import api from "../api/axios";
import type { LoginResponse, User } from "../types";

interface AuthContextType {
    user: User | null;
    token: string | null;

    login: (
        email: string,
        password: string
    ) => Promise<void>;

    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

interface Props {
    children: ReactNode;
}

export function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            return null;
        }


        try {
            const parsedUser: unknown = JSON.parse(storedUser);

            if (
                !parsedUser ||
                typeof parsedUser !== "object" ||
                !("role" in parsedUser)
            ) {
                localStorage.removeItem("user");
                return null;
            }

            return parsedUser as User;
        } catch (error) {
            console.error("Invalid user data in localStorage:", error);
            localStorage.removeItem("user");
            return null;
        }
    });
    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem("token")
    );
    //const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     setLoading(false);
    // }, []);
   
    const login = async (
        email: string,
        password: string
    ) => {
        
            const response = await api.post<LoginResponse>(
                "/auth/login",
                {
                    email,
                    password,
                }
            );

            const data = response.data.data;

            localStorage.setItem("token", data.token.access_token);
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );
            //console.log("data", data.token, data.user);
            setToken(data.token.access_token);
            setUser(data.user);
       
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch {

        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,

                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}
