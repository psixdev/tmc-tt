import styled, { css } from 'styled-components';
import Container from '../components/Container';
import Containers from '../components/Containers';
import List from '../components/List';
import Page from '../components/Page';
import Title from '../components/Title';
import useList from './useList';
import { useCallback, useState } from 'react';
import Button from '../components/Button';

const CreateForm = styled.form`
	display: flex;
	justify-content: space-between;
	gap: 20px;
	margin-top: 20px;
`;

const InputContainer = styled.div`
	flex: 1 1 auto;
`;
const ButtonContainer = styled.div``;

const Input = styled.input`
	width: 100%;
	padding: 6px 10px;
	background: white;
	border: 1px solid #9e9e9e;
	border-radius: 20px;
	font-size: 1em;

	&:focus {
		border-color: #2196f3;
	}

	&::placeholder {
		font-size: 13px;
	}

	${({ $error }) => $error && css`
		border-color: #f44336;
	`}
`;

const ID_MIN = 1;
const ID_MAX = 5e6;

function isIdValid(id) {
	return id >= ID_MIN && id <= ID_MAX;
}

function isFormValid({ id }) {
	return isIdValid(id);
}

function Main() {
	const [idTouched, setIdTouched] = useState(false);
	const [id, setId] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleIdChange = useCallback((event) => {
		if (!idTouched)
			setIdTouched(true);

		setId(Number(event.target.value));
	});

	const handleSubmit = useCallback((event) => {
		event.preventDefault();

		if (!isFormValid({ id }))
			return;

		setIsSubmitting(true);

		fetch('/api/1.0/items', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({ id })
		})
			.then((res) => {
				if (!res.ok)
					return;

				addItem(id);
			})
			.finally(() => {
				setIsSubmitting(false);
			});
	});

	const { addItem, removeItem, ...listProps } = useList({ selected: false });
	const {
		addItem: addSelectedItem,
		removeItem: removeSelectedItem,
		...selectedListProps
	} = useList({ selected: true });

	const handleToggleItem = useCallback((id, selected) => {
		fetch(`/api/1.0/items/${id}/toggle`, { method: 'POST' })
			.then((res) => {
				if (!res.ok)
					return;

				if (selected) {
					removeSelectedItem(id);
					addItem(id);
				} else {
					removeItem(id);
					addSelectedItem(id);
				}
			});
	}, []);

	return (
		<Page>
			<Containers>
				<Container>
					<Title>Все элементы</Title>
					<List
						{...listProps}
						onToggleItem={handleToggleItem}
					/>
					<CreateForm onSubmit={handleSubmit}>
						<InputContainer>
							<Input
								id="id"
								onChange={handleIdChange}
								type="number"
								min={ID_MIN}
								max={ID_MAX}
								placeholder={`id (${ID_MIN}-${ID_MAX})`}
								$error={idTouched && !isIdValid(id)}
							/>
						</InputContainer>
						<ButtonContainer>
							<Button
								type="submit"
								disabled={isSubmitting || !isFormValid({ id })}
							>
								Создать
							</Button>
						</ButtonContainer>
					</CreateForm>
				</Container>
				<Container>
					<Title>Выбранные</Title>
					<List
						{...selectedListProps}
						onToggleItem={handleToggleItem}
						selected
					/>
				</Container>
			</Containers>
		</Page>
	);
}

export default Main;
