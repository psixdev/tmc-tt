import { useCallback, useEffect, useRef, useState } from 'react';
import { move } from '@dnd-kit/helpers';

const LIMIT = 20;

function useList({ selected }) {
	const [items, setItems] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);

	const offsetRef = useRef(0);

	const loadingRef = useRef(loading);
	const hasMoreRef = useRef(hasMore);

	useEffect(() => {
		loadingRef.current = loading;
		hasMoreRef.current = hasMore;
	}, [loading, hasMore]);

	const loadMore = useCallback(() => {
		if (!hasMoreRef.current || loadingRef.current)
			return;

		setLoading(true);

		const offset = offsetRef.current;

		offsetRef.current += LIMIT;

		fetch(`/api/1.0/items?limit=${LIMIT}&offset=${offset}&selected=${selected}`)
			.then((res) => res.json())
			.then((items) => {
				setHasMore(items.length === LIMIT);

				setItems((prev) => [
					...prev,
					...items
				]);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const addItem = useCallback((id) => {
		offsetRef.current++;
		setItems((prev) => {
			return [{ id }, ...prev];
		})
	}, []);

	const removeItem = useCallback((id) => {
		offsetRef.current--;
		setItems((prev) => {
			return prev.filter((item) => item.id !== id)
		})
	}, []);

	const moveItem = useCallback((fromIndex, toIndex) => {
		const item = items[fromIndex];

		fetch(`/api/1.0/items/${item.id}/order`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({ position: toIndex })
		})
			.then((res) => {
				if (!res.ok) {
					setItems((prev) => [...prev]); // ?
					return;
				}

				setItems((prev) => {
					const items = [...prev];

					items.splice(fromIndex, 1);
					items.splice(toIndex, 0, item);

					return items;
				});
			});
	}, [items])

	return { items, loading, hasMore, loadMore, addItem, removeItem, moveItem };
}

export default useList;
