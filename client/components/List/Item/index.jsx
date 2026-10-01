import Button from '../../Button';
import Item from './Item';
import { memo } from 'react';

function ItemWrapper({ id, selected, onClick }) {
	return (
		<Item>
			{id}
			<Button onClick={onClick} data-id={id}>{selected ? '<' : '>'}</Button>
		</Item>
	);
}

export default memo(ItemWrapper);
