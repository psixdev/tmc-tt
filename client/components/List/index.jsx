import { move } from '@dnd-kit/helpers';
import Item from './Item';
import List from './List';
import Observer from './Observer';
import Spacer from './Spacer';
import { DragDropProvider } from '@dnd-kit/react';
import { memo, useCallback, useEffect, useRef} from 'react';

function ListWrapper({
	items,
	loading,
	hasMore,
	loadMore,
	moveItem,
	onToggleItem,
	selected = false
}) {
	const containerRef = useRef(null);
	const observerRef = useRef(null);

	const handleToggleClick = useCallback((event) => {
		onToggleItem(Number(event.currentTarget.dataset.id), selected);
	}, []);

	const handleDragEnd = useCallback((event) => {
		const { source, target } = event.operation;

		const fromIndex = source.sortable.initialIndex;
		const toIndex = target.sortable.index;

		moveItem(fromIndex, toIndex);
	}, [items]);

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
		<DragDropProvider onDragEnd={handleDragEnd}>
			<List ref={containerRef}>
				{items.map(({ id }, index) => (
					<Item
						key={id}
						id={id}
						index={index}
						selected={selected}
						onClick={handleToggleClick}
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
		</DragDropProvider>
	);
}

export default memo(ListWrapper);
