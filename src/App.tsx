import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import User from "./pages/User";
import UserCreate from "./pages/UserCreate";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/"
                        element={<Dashboard />}
                    />
                </Route>
                <Route element={<ProtectedRoute adminOnly />}>
                    <Route
                        path="/users"
                        element={<User />}
                    />
                    <Route
                        path="/users/create"
                        element={<UserCreate />}
                    />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}
