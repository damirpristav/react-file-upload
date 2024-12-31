import axios from 'axios';
import { PaginatedData } from '../types';

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    Accept: 'application/json',
  },
});

export const fetcher = <T>(url: string): Promise<PaginatedData<T>> => api.get(url).then((res) => res.data);
