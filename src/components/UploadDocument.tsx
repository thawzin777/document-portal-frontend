import {
    useRef,
    useState,
    type FormEvent,
} from "react";
import axios from "axios";

import api from "../api/axios";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Props {
    onUploaded: () => void;
}

export default function UploadDocument({
    onUploaded,
}: Props) {
    const [title, setTitle] = useState("");

    const [file, setFile] =
        useState<File | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setError("");

        if (!file) {
            setError("Please select a file");
            return;
        }

        const formData = new FormData();

        formData.append("title", title);
        formData.append("file", file);

        try {
            setLoading(true);

            await api.post("/documents",formData);

            setTitle("");
            setFile(null);
            if(fileInputRef.current){
                fileInputRef.current.value = "";
            }
            onUploaded();
        } catch (requestError: unknown) {
            const message = axios.isAxiosError(requestError)
                ? requestError.response?.data?.message
                : undefined;

            setError(
                typeof message === "string"
                    ? message
                    : "Upload failed"
            );
        } finally {
            setLoading(false);
        }
    };
 
    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload document</CardTitle>
                <CardDescription>
                    Add a document to your workspace.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        placeholder="Document title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <Input
                        ref={fileInputRef}
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        required
                    />

                    {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

                    <Button type="submit" disabled={loading}>
                        {loading ? "Uploading..." : "Upload document"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
