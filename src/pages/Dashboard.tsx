import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import DashboardPage from "@/app/dashboard/page";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import type { Document, Pagination, PaginationResponse } from "../types";

function getErrorMessage(error: unknown, fallback: string) {
    if (!axios.isAxiosError(error)) {
        return fallback;
    }

    const message = error.response?.data?.message;

    return typeof message === "string" ? message : fallback;
}

export default function Dashboard() {
    const { user } = useAuth();
    const [documents, setDocuments] = useState<Document[]>([]);
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
    const loadDocuments = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get<PaginationResponse<Document>>(
                "/documents"
            );

            setDocuments(response.data.data);
            setPagination(response.data);
        } catch (requestError: unknown) {
            setError(getErrorMessage(requestError, "Failed to load documents"));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadDocuments();
    }, [loadDocuments]);
    console.log("documents", documents);
    const deleteDocument = async (documentId: number) => {
        try {
            await api.delete(`/documents/${documentId}`);
            setDocuments((prevDocuments) =>
                prevDocuments.filter((doc) => doc.id !== documentId)
            );
            setToastMessage("Document deleted successfully.");
            setToastType('success');
            setShowToast(true);
        } catch (requestError: unknown) {
           // setError(getErrorMessage(requestError, "Failed to delete document"));
            setToastMessage(getErrorMessage(requestError, "Failed to delete document"));
            setToastType('error');
            setShowToast(true);
        }finally {
            setTimeout(() => {
                setShowToast(false);
            }, 3000); // Hide toast after 3 seconds
        }
    };
    

    const getFileUrl = (filePath: string) => {
        const apiUrl = import.meta.env.VITE_API_URL;
        const storageBaseUrl = apiUrl ? apiUrl.replace(/\/api\/?$/, "") : "";

        return `${storageBaseUrl}/storage/${filePath.replace(/^\//, "")}`;
    };
 const handlePageChange = (page: number) => {
        //setLoading(true);
        api.get<PaginationResponse<Document>>(`/documents?page=${page}`)
            .then((response) => {
                setDocuments(response.data.data);
                setPagination(response.data);
            })
            .catch((requestError: unknown) => {
                setError(getErrorMessage(requestError,'Failed to load documents'));
            })
            .finally(() => {
                //setLoading(false);
            });
    };
    return (
        <DashboardPage
            documents={documents}
            loading={loading}
            error={error}
            currentUserId={user?.id}
            getFileUrl={getFileUrl}
            onDeleteDocument={deleteDocument}
            showToast={showToast}
            setShowToast={setShowToast}
            setToastType={setToastType}
            setToastMessage={setToastMessage}
            toastType={toastType}
            toastMessage={toastMessage}
            onUploaded={loadDocuments}
            setPagination={setPagination}
            pagination={pagination}
            handlePageChange={handlePageChange}
        />
    );
}
