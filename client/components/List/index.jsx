import Item from './Item';
import List from './List';
import Observer from './Observer';
import Spacer from './Spacer';
import { memo, useCallback, useEffect, useRef } from 'react';

function ListWrapper({
	items,
	loading,
	hasMore,
	loadMore,
	onToggleItem,
	selected = false
}) {
	const containerRef = useRef(null);
	const observerRef = useRef(null);

	const toggleItem = useCallback((event) => {
		onToggleItem(Number(event.currentTarget.dataset.id), selected);
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					loadMore();
				}
			},
			{
				root: containerRef.current,
				rootMargin: '100px',
			}
		);

		if (observerRef.current) {
			observer.observe(observerRef.current);
		}

		return () => observer.disconnect();
	}, [loadMore]);

	return (
		<List ref={containerRef}>
			{items.map(({ id }) => (
				<Item
					key={id}
					id={id}
					selected={selected}
					onClick={toggleItem}
				/>
			))}
			{!items.length && !loading && (
				<Spacer>Нет элементов</Spacer>
			)}
			{hasMore && (
				<Observer ref={observerRef} />
			)}
			{loading && (
				<Spacer>Загрузка...</Spacer>
			)}
		</List>
	);
}

export default memo(ListWrapper);
