import { useState } from 'react';
import useSWR from 'swr';

import { fetcher } from '../config';
import { Image } from '../types';

export const useImagesSwr = ({ page }: { page: number }) => {
  return useSWR(`/images?page=${page}`, fetcher<Image>, { revalidateOnFocus: false });
};

export const useImages = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, mutate } = useImagesSwr({ page: currentPage });

  const goToPrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return { data, isLoading, currentPage, setCurrentPage, mutate, goToNextPage, goToPrevPage };
};
