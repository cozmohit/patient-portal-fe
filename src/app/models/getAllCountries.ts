export interface GetAllCountries {
    id: number;
    name: string;
    code: string;
    population: number;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;

}

export interface GetAllCountriesResponse {
    count: number;
    next: string | null;
    previous: string | null;
    page_size: number;
    total_pages: number;
    current_page: number;
    results: GetAllCountries[];
}