import { CheckCircle2, ChevronLeft, ChevronRight, FileTextIcon, Trash2Icon, XCircle } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import UploadDocument from "@/components/UploadDocument"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import type { Document, Pagination } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
interface DashboardPageProps {
    documents: Document[]
    loading: boolean
    error: string
    currentUserId?: number
    getFileUrl: (filePath: string) => string
    onDeleteDocument: (documentId: number) => Promise<void>
    onUploaded: () => void
    setToastMessage: (message: string) => void
    setToastType: (type: 'success' | 'error') => void
    setShowToast: (show: boolean) => void
    showToast: boolean
    toastMessage: string
    toastType: string
    setPagination: (pagination: Pagination) => void
    pagination: Pagination
    handlePageChange: (page: number) => void
}

export default function DashboardPage({
    documents,
    loading,
    error,
    currentUserId,
    getFileUrl,
    onDeleteDocument,
    onUploaded,
    showToast,
    toastMessage,
    toastType,
    pagination,
    handlePageChange,
}: DashboardPageProps) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
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
                        <h1 className="text-2xl font-semibold">Documents</h1>
                        <p className="text-sm text-muted-foreground">
                            View, upload, and manage your documents.
                        </p>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
                        <section aria-labelledby="documents-heading">
                            <h2 id="documents-heading" className="sr-only">Your documents</h2>

                            {/* {loading && <p className="text-sm text-muted-foreground">Loading documents...</p>} */}

                            {loading ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <Card key={i}>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <FileTextIcon className="size-4" />
                                                    <Skeleton className="h-4 w-[250px]" />
                                                </CardTitle>

                                                <CardDescription>
                                                    <Skeleton className="h-4 w-[150px]" />
                                                </CardDescription>

                                                <CardAction>
                                                    <Skeleton className="size-8" />
                                                </CardAction>
                                            </CardHeader>

                                            <CardFooter>
                                                <Skeleton className="h-4 w-[120px]" />
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            ) : error ? (
                                <div className="text-destructive">
                                    {error}
                                </div>
                            ) : documents.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {documents.map((document) => (
                                        <Card key={document.id}>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <FileTextIcon className="size-4" />
                                                    {document.title}
                                                </CardTitle>

                                                <CardDescription>
                                                    {document.user_name}
                                                </CardDescription>

                                                {document.user_id === currentUserId && (
                                                    <CardAction>
                                                        <Button
                                                            aria-label={`Delete ${document.title}`}
                                                            variant="ghost"
                                                            size="icon-sm"
                                                            onClick={() =>
                                                                void onDeleteDocument(document.id)
                                                            }
                                                        >
                                                            <Trash2Icon className="text-destructive" />
                                                        </Button>
                                                    </CardAction>
                                                )}
                                            </CardHeader>

                                            <CardFooter>
                                                <a
                                                    className="text-sm font-medium text-primary hover:underline"
                                                    href={getFileUrl(document.file_path)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    View document
                                                </a>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-10 text-center text-muted-foreground">
                                    No documents found.
                                </div>
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
                            <UploadDocument onUploaded={onUploaded} />
                        </aside>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
