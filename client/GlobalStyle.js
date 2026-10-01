import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
	* {
		box-sizing: border-box;

		&::before,
		&::after {
			box-sizing: border-box;
		}
	}

	html,
	body {
		height: 100%;
	}

	body {
		margin: 0;

		line-height: 1.2;
	}

	body,
	input,
	textarea {
		font-family: Roboto, sans-serif;
		font-size: 16px;
	}

	a,
	button,
	input,
	textarea {
		&:hover,
		&:focus,
		&:active {
			outline: none;
		}
	}

	button::-moz-focus-inner {
		border: 0;
	}

	input {
		border-radius: 0;

		appearance: none;

		&::-webkit-search-cancel-button,
		&::-webkit-search-decoration {
			appearance: none;
		}
	}

	button {
		/* for safari */
		margin-right: 0;
		margin-left: 0;
	}

	p {
		margin: 0;
	}

	#root {
		height: 100%;
	}
`;
