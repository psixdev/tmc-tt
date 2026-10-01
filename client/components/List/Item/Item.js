import Observer from '../Observer';
import styled, { css } from 'styled-components';

const Item = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 10px 12px;
	border-bottom: 1px solid #e0e0e0;
	opacity: 1;

	&:last-child, &:has(+ ${Observer}){
		border-bottom: none;
	}

	${({ $isDragging }) => $isDragging && css`
		opacity: 0.5;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
	`}
`;

export default Item;
