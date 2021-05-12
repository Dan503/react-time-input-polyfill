var gulp = require('gulp')
var browserify = require('browserify')
var uglify = require('gulp-uglify')
var buffer = require('vinyl-buffer')
var source = require('vinyl-source-stream')
var sourcemaps = require('gulp-sourcemaps')
var rename = require('gulp-rename')
var rollup = require('gulp-better-rollup')
var babel = require('rollup-plugin-babel')
var exec = require('child_process').exec

var isProduction = () => process.env.NODE_ENV === 'production'

const setEnv = (env) => (done) => {
	process.env.NODE_ENV = env
	done()
}
gulp.task('set_dev_env', setEnv('development'))
gulp.task('set_prod_env', setEnv('production'))

gulp.task('webpack', (done) => {
	exec(
		`node scripts/${isProduction() ? 'build' : 'start'}.js`,
		function (err, stdout, stderr) {
			console.log(stdout)
			console.log(stderr)
			done(err)
		},
	)
})

gulp.task('watch', (done) => {
	gulp.watch('./timePolyfillHelpers.js').on(
		'change',
		gulp.series('browserify'),
	)
	done()
})

gulp.task('browserify', () => {
	return browserify({
		// entry file defined here
		entries: ['./timePolyfillHelpers.js'],
		debug: true,
		transform: ['babelify'],
	})
		.bundle()
		.pipe(source('timePolyfillHelpers.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest('./dist'))
		.pipe(gulp.dest('./test-site/public'))
})

gulp.task('npm-rollup', () => {
	return (
		gulp
			.src('index.js')
			.pipe(sourcemaps.init())
			.pipe(
				rollup(
					{
						// There is no `input` option as rollup integrates into the gulp pipeline
						plugins: [babel()],
					},
					{
						// Rollups `sourcemap` option is unsupported. Use `gulp-sourcemaps` plugin instead
						format: 'cjs',
					},
				),
			)
			// inlining the sourcemap into the exported .js file
			.pipe(sourcemaps.write())
			.pipe(
				rename((path) => {
					path.basename += '.cjs'
				}),
			)
			.pipe(gulp.dest('dist'))
	)
})

gulp.task('compile', gulp.parallel('webpack', 'browserify'))

gulp.task(
	'default',
	gulp.series('set_dev_env', gulp.parallel('watch', 'compile')),
)
gulp.task('build', gulp.series('set_prod_env', 'compile'))
