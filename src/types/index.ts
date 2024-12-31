export type PaginatedData<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
};

export type Image = {
  id: string;
  url: string;
  path: string;
  name: string;
  size: number;
  type: string;
  created_at: Date;
  updated_at: Date;
};
