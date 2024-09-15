'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequest } from 'ahooks';
import { Spinner } from '@radix-ui/themes';
import MyPagination from '@/components/MyPagination';
import CommonCardSection from '@/components/CommonCardSection';

export default function ActressMoviesClient({ initialPage, initialActressName }) {
  const router = useRouter();
  const [page, setPage] = useState(parseInt(initialPage) || 1);
  const [actressName, setActressName] = useState(initialActressName || '');

  const { data, loading, error } = useRequest(
    async () => {
      const resp = await fetch(`/api/movies/actressRel/all`, {
        method: 'POST',
        body: JSON.stringify({ page, actressName }),
      });
      const data = await resp.json();
      data.movies?.forEach((x) => {
        x.coverUrl = `${process.env.NEXT_PUBLIC_MINIO_PATH}/${x.coverUrl}`;
      });
      return data;
    },
    {
      refreshDeps: [page, actressName],
    }
  );

  useEffect(() => {
    router.push(`/actressMovies?page=${page}&actressName=${actressName}`);
  }, [page, actressName, router]);

  const { totalCount, currentPage, totalPages } = data?.pagination || {};

  if (error) {
    console.error('Error fetching movies:', error);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Spinner size="3" />
      </div>
    );
  }

  return (
    <>
      <CommonCardSection movies={data?.movies || []} />
      <MyPagination
        current={currentPage}
        totalPage={totalPages}
        totleCount={totalCount}
        onChange={(newPage) => setPage(newPage)}
      />
    </>
  );
}
