export interface User {
    id: number;
    name: string;
    email: string;
    role: "admin" | "user";
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}
export interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}
export interface PaginationResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
export interface Document {
    id: number;
    user_id: number;
    user_name: string;
    title: string;
    file_path: string;
    created_at: string;
    updated_at: string;
    user: User;
}

export interface ApiResponse<T> {
    data: T;
}
export interface Token{
    access_token: string;
    token_type: string;
    expires_in: number;
}
export interface LoginData {
    message: string;
    user: User;
    token:Token;
}

export interface LoginResponse {
    data: LoginData;
}
