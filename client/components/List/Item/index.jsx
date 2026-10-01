import Button from '../../Button';
import Item from './Item';
import { memo } from 'react';
import { useSortable } from '@dnd-kit/react/sortable';

function ItemWrapper({ id, index, selected, onClick }) {
	const { ref, attributes, listeners, isDragging, transform } =
		useSortable({ id, index });

	return (
		<Item
			ref={ref}
			$isDragging={isDragging}
			{...attributes}
			{...listeners}
			style={{ transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,}}
		>
			{id}
			<Button onClick={onClick} data-id={id}>{selected ? '<' : '>'}</Button>
		</Item>
	);
}

export default memo(ItemWrapper);
