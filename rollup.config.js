import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'

process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	plugins: [
		commonjs(),
		nodeResolve(),
		babel({
			babelHelpers: 'runtime',
			presets: ['@babel/preset-env'],
			exclude: '**/node_modules/**',
			plugins: [
				['@babel/plugin-proposal-class-properties', { loose: true }],
				['@babel/plugin-proposal-private-methods', { loose: true }],
				[
					'@babel/plugin-proposal-private-property-in-object',
					{ loose: true },
				],
			],
		}),
	],
	input: './src/core/requiredPolyfillUtils.js',
	output: {
		file: './public/requiredTimeInputPolyfillUtils.js',
		format: 'iife',
		// globals: [

		// ],
	},
	// compact: true,
}
