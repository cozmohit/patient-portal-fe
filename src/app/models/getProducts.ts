export interface GetProducts {
    id: number;
    name: string;
    description: string;
    product_url: string;
}

export interface GetProductsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    page_size: number;
    total_pages: number;
    current_page: number;
    results: GetProducts[];
}