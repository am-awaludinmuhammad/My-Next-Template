
export interface PaginatedResponse<T> {
  data: T[];
  total_count: number
  total_pages: number
  current_page: number
  per_page: number
}
