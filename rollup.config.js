import babelPlugin from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

const plugins = [
	commonjs({
		include: ['node_modules/**'],
		exclude: ['node_modules/process-es6/**'],
		namedExports: {
			'node_modules/react/index.js': [
				'Children',
				'Component',
				'PropTypes',
				'createElement',
				'createRef',
			],
			'node_modules/react-dom/index.js': ['render'],
		},
	}),
	nodeResolve(),
	babelPlugin({
		presets: [
			[
				'@babel/preset-env',
				{
					modules: false,
					targets: {
						browsers: '> 0.1%, IE 11, not op_mini all, not dead',
						node: 8,
					},
				},
			],
		],
		babelrc: false,
		exclude: 'node_modules/**',
	}),
]

const rollupConfig = [
	{
		input: './src/time-polyfill/timePolyfillHelpers.js',
		output: [
			{
				file: './timePolyfillHelpers.js',
				format: 'iife',
			},
			{
				file: './dist/timePolyfillHelpers.js',
				format: 'iife',
			},
			{
				file: './public/timePolyfillHelpers.js',
				format: 'iife',
			},
		],
		plugins: [...plugins, terser()],
	},
	{
		input: './src/time-polyfill/ReactTimeInputPolyfill.js',
		output: [
			{
				file: './dist/ReactTimeInputPolyfill.cjs.js',
				format: 'cjs',
				exports: 'default',
			},
		],
		plugins,
	},
]

export default rollupConfig
