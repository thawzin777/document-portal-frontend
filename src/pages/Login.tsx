import { useState, type FormEvent } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { LoginForm } from "@/components/login-form";

export default function Login() {
    const navigate = useNavigate();

    const { login, token } = useAuth();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    if (token) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);

            navigate("/");
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.error
                : undefined;
            console.log(message)
            setError(message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <LoginForm
                onSubmit={handleSubmit}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                error={error}
                loading={loading}
            />
        </div>
    );
}
