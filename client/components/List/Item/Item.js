import Observer from '../Observer';
import styled from 'styled-components';

const Item = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 10px 12px;
	border-bottom: 1px solid #e0e0e0;

	&:last-child, &:has(+ ${Observer}){
		border-bottom: none;
	}
`;

export default Item;
