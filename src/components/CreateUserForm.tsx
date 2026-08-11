import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import api from "../api/axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "./ui/card";
import { CardTitle } from "./ui/card";
import { Label } from "./ui/label";


interface CreateUserFormProps {
    onUserCreated?: () => void;
    setToastMessage?: (message: string) => void;
    setToastType?: (type: 'success' | 'error') => void;
    setShowToast?: (show: boolean) => void;
    showToast?: boolean;
    toastMessage?: string;
    toastType?: string;
}
export default function CreateUserForm({ onUserCreated, setToastMessage, setToastType, setShowToast}: CreateUserFormProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const items = [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
    ]
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);

            await api.post("/users", {
                name,
                email,
                password,
                role,
            });

            setName("");
            setEmail("");
            setPassword("");
            setRole("user");
            setToastMessage && setToastMessage("User created successfully.");
            setToastType && setToastType('success');
            setShowToast && setShowToast(true);
            onUserCreated && onUserCreated();
        } catch (requestError: unknown) {
            const message = axios.isAxiosError(requestError)
                ? requestError.response?.data?.message
                : undefined;
            setToastMessage && setToastMessage(typeof message === "string" ? message : "Failed to create user");
            setToastType && setToastType('error');
            setShowToast && setShowToast(true);
        } finally {
            setLoading(false);
        }
    };
  useEffect(() => {
    if (onUserCreated) {
      onUserCreated();
    }
  }, [onUserCreated]);
    
    return (
       <div className="">
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
        >
            {error && (
                <div className="text-sm text-destructive">
                    {error}
                </div>
            )}

            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Create User</CardTitle>
                    <CardDescription>
                        Enter the user details below to create a new user
                    </CardDescription>

                </CardHeader>
                <CardContent>
                    
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>

                                </div>
                                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <Select items={items} value={items.find((item) => item.value === role)?.value || undefined}
                                onValueChange={(value) => setRole (value || "user")}
                                    >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {items.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>
                   
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full">
                        {loading ? "Creating..." : "Create User"}
                    </Button>

                </CardFooter>
            </Card>
        </form>
       </div>
    );
}