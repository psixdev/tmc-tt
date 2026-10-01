const express = require('express');
const morgan = require('morgan');
const path = require('path');

const PORT = 7000;

const items = [];
const selectedItems = [];
const itemsMap = new Map();

function addItem(id) {
	items.unshift({ id });
	itemsMap.set(id, false);

	return { id };
}

function getItems(offset, limit, selected) {
	const currentItems = selected ? selectedItems : items;

	return currentItems.slice(offset, offset + limit);
}

function itemExists(id) {
	return itemsMap.has(id);
}

function toggleItem(id) {
	console.log('toggle item', id);

	const selected = itemsMap.get(id);
	const [from, to] = selected ? [selectedItems, items] : [items, selectedItems];

	const index = from.findIndex((item) => item.id === id);

	console.log('index', index);

	if (index !== -1) {
		from.splice(index, 1);
		to.unshift({ id });
	}

	itemsMap.set(id, !selected)

	console.log('success');
}

function moveItem(id, position) {
	// const index = items.findIndex((item) => item.id === id);

	// const item = items[index];
	// items.splice(index, 1);
	// items.splice(position, 0, item);
}

// for (let i = 1; i <= 1e6; i++) {
for (let i = 1; i <= 100; i++) {
	addItem(i);
}

// toggleItem(63);
// moveItem(62, 17);

// console.log(getItems(0, 20, false));

function isValidId(id) {
	return Number.isInteger(id) && id > 0;
}

async function init() {
	const app = express();

	app.set('view engine', 'pug');
	app.set('views', path.join(__dirname, 'views'));

	app.use(express.json());

	app.use(express.static(path.join(__dirname, 'static')));

	app.use(morgan('tiny'))

	const router = express.Router();

	router.get('/', (req, res) => {
		res.render('index');
	})

	router.get('/api/1.0/items', (req, res) => {
		const selected = 'selected' in req.query && req.query.selected != 'false';
		const offset = Number(req.query.offset) || 0;

		var limit = Number(req.query.limit) || 20;

		if (limit < 0)
			limit = 20;

		const items = getItems(offset, limit, selected);

		console.log('>', offset, limit, selected, items.length);

		res.status(200).json(items);
	});

	router.post('/api/1.0/items', (req, res) => {
		const id = Number(req.body.id);

		if (!isValidId(id)) {
			return res.status(400).json({ message: 'invalid id', userMessage: 'невалидный id' });
		}

		if (itemExists(id))
			return res.status(409).json({ message: 'item exists', userMessage: 'сущность существует' });


		item = addItem(id);

		res.status(201).json(item);
	});

	router.post('/api/1.0/items/:id/toggle', (req, res) => {
		const id = Number(req.params.id);

		if (!isValidId(id)) {
			return res.status(400).json({ message: 'invalid id', userMessage: 'невалидный id' });
		}

		toggleItem(id);

		console.log('after toggle');

		res.status(204).send();
	});

	router.post('/api/1.0/items/:id/order', (req, res) => {
		const id = Number(req.query.id);
		const position = Number(req.body.position);

		if (!isValidId(id)) {
			return res.status(400).json({ message: 'invalid id', userMessage: 'невалидный id' });
		}

		moveItem(id, position);

		res.status(204).send();
	});

	app.use(router);

	app.use((req, res) => {
		console.log('not found error');
		res.status(404).json({ message: 'page not found', userMessage: 'страница не найдена'});
	});

	// app.use((err, req, res, next) => {
	// 	console.error('--->');
	// 	console.error(err.stack);

	// 	// 2. Определяем статус-код (по умолчанию 500 — внутренняя ошибка сервера)
	// 	const statusCode = err.statusCode || 500;

	// 	// 3. Отправляем красивый JSON-ответ клиенту
	// 	res.status(statusCode).json({
	// 		status: 'error',
	// 		message: err.message || 'Internal Server Error'
	// 	});
	// });

	app.listen(PORT, () => {
		console.log(`Server started on :${PORT}`);
	});
}

init().catch((error) => {
	console.error(error?.stack || error);
	process.exit(1);
});
