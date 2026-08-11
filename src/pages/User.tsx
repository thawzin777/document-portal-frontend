import { useCallback, useEffect, useState, type CSSProperties } from "react";
import axios from "axios";
import { CheckCircle2, ChevronLeft, ChevronRight, MailIcon, UsersIcon, XCircle } from "lucide-react";

import api from "@/api/axios";
import { AppSidebar } from "@/components/app-sidebar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Pagination, PaginationResponse, User as UserType } from "@/types";

import CreateUserForm from "@/components/CreateUserForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
function getErrorMessage(error: unknown) {
    if (!axios.isAxiosError(error)) {
        return "Failed to load users";
    }

    const message = error.response?.data?.message;

    return typeof message === "string" ? message : "Failed to load users";
}

export default function Users() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState('success');
    const [toastMessage, setToastMessage] = useState('');
    const [pagination, setPagination] = useState<Pagination>({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0,
    });
    const loadUsers = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get<PaginationResponse<UserType>>("/users");
            setUsers(response.data.data);
            setPagination(response.data);
        } catch (requestError: unknown) {
            setError(getErrorMessage(requestError));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadUsers();
    }, [loadUsers]);
    const handlePageChange = (page: number) => {
        //setLoading(true);
        api.get<PaginationResponse<UserType>>(`/users?page=${page}`)
            .then((response) => {
                setUsers(response.data.data);
                setPagination(response.data);
            })
            .catch((requestError: unknown) => {
                setError(getErrorMessage(requestError));
            })
            .finally(() => {
                //setLoading(false);
            });
    };
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader title="Users" />
                <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                    {showToast && (
                        <div
                            className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
                                } text-white animate-in fade-in slide-in-from-top-5`}
                        >
                            {toastType === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                            <span>{toastMessage}</span>
                        </div>
                    )}
                    <div className="flex flex-col gap-1">
                        <div className="">
                            <h1 className="text-2xl font-semibold">Users</h1>
                            <p className="text-sm text-muted-foreground">
                                Manage the users in your workspace.
                            </p>
                        </div>

                    </div>

                    {/* {loading && (
                        <p className="text-sm text-muted-foreground">Loading users...</p>
                    )}

                    {!loading && error && (
                        <p className="text-sm text-destructive" role="alert">{error}</p>
                    )}

                    {!loading && !error && users.length === 0 && (
                        <Card>
                            <CardContent className="py-10 text-center text-muted-foreground">
                                No users found.
                            </CardContent>
                        </Card>
                    )} */}
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
                        <section aria-labelledby="users-heading">
                            {loading ? (
                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <Card key={i}>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <UsersIcon className="size-4" />
                                                    <Skeleton className="h-4 w-[250px]" />
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-2">
                                                    <MailIcon className="size-4" />
                                                    <Skeleton className="h-4 w-[250px]" />
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <Skeleton className="size-8" />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : error ? (
                                <p className="text-sm text-destructive" role="alert">{error}</p>
                            ) : users.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    {users.map((user) => (
                                        <Card key={user.id}>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <UsersIcon className="size-4" />
                                                    {user.name}
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-2">
                                                    <MailIcon className="size-4" />
                                                    {user.email}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium capitalize">
                                                    {user.role}
                                                </span>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card>
                                    <CardContent className="py-10 text-center text-muted-foreground">
                                        No users found.
                                    </CardContent>
                                </Card>
                            )}
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Showing {pagination?.from} to {pagination?.to} of {pagination?.total}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handlePageChange(pagination.current_page - 1)}
                                        disabled={pagination.current_page === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    {Array.from({ length: pagination.last_page }, (_, i) => (
                                        <Button
                                            key={i + 1}
                                            size="icon"
                                            onClick={() => handlePageChange(i + 1)}
                                            variant={i + 1 === pagination.current_page ? 'default' : 'outline'}
                                        >
                                            {i + 1}
                                        </Button>
                                    ))}
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handlePageChange(pagination.current_page + 1)}
                                        disabled={pagination.current_page === pagination.last_page}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </section>

                        <aside>
                            <CreateUserForm
                                // onUserCreated={loadUsers}
                                setToastMessage={setToastMessage}
                                setToastType={setToastType}
                                setShowToast={setShowToast}
                            />
                        </aside>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
