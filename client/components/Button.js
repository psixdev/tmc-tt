import styled from "styled-components";

export default styled.button.attrs(({ type = 'button' }) => ({ type }))`
	padding: 6px 10px;
	background: white;
	border: 1px solid #9e9e9e;
	border-radius: 20px;
	opacity: 1;
	cursor: pointer;
	font-size: 1em;

	&:hover:not([disabled]) {
		border-color: #2196f3;
	}

	&[disabled] {
		opacity: 0.5;
		cursor: default;
	}
`;
