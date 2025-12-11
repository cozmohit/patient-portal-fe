export interface GetUsers {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    role_id: string;
    is_active: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface GetUsersResponse {
    count: number;
    next: string | null;
    previous: string | null;
    page_size: number;
    total_pages: number;
    current_page: number;
    results: GetUsers[];
}

export interface CreateUser {
    email: string;
    first_name: string;
    last_name: string;
    role_id: number;
    phone_number: string;
}