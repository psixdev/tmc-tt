const path = require('path');
const { ProvidePlugin } = require('webpack');

module.exports = {
	mode: 'none',

	entry: './client/index.jsx',

	output: {
		path: path.resolve(__dirname, 'static/scripts'),
		filename: 'app.js',
		clean: true,
	},

	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							['@babel/preset-env', { modules: 'commonjs' }],
							['@babel/preset-react', { runtime: 'automatic' }],
						],
					},
				},
			},
		],
	},

	resolve: {
		extensions: ['.js', '.jsx'],
	},

	plugins: [
		new ProvidePlugin({
			process: 'process/browser',
		}),
	],

	devtool: 'source-map',
};
