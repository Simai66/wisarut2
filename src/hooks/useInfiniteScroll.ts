import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
    loading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    threshold?: number;
    rootMargin?: string;
}

/**
 * Hook for implementing infinite scroll
 */
export const useInfiniteScroll = ({
    loading,
    hasMore,
    onLoadMore,
    threshold = 0.1,
    rootMargin = '100px',
}: UseInfiniteScrollOptions) => {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (target?.isIntersecting && hasMore && !loading) {
                onLoadMore();
            }
        },
        [hasMore, loading, onLoadMore]
    );

    useEffect(() => {
        const element = loadMoreRef.current;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(handleObserver, {
            threshold,
            rootMargin,
        });

        if (element) {
            observerRef.current.observe(element);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [handleObserver, threshold, rootMargin]);

    return { loadMoreRef };
};
