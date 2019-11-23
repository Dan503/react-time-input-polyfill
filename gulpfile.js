var gulp = require('gulp')
var browserify = require('browserify')
var uglify = require('gulp-uglify')
var buffer = require('vinyl-buffer')
var source = require('vinyl-source-stream')

var exec = require('child_process').exec

var isProduction = () => process.env.NODE_ENV === 'production'

const setEnv = env => done => {
	process.env.NODE_ENV = env
	done()
}
gulp.task('set_dev_env', setEnv('development'))
gulp.task('set_prod_env', setEnv('production'))

gulp.task('webpack', done => {
	exec(`node scripts/${isProduction() ? 'build' : 'start'}.js`, function(
		err,
		stdout,
		stderr,
	) {
		console.log(stdout)
		console.log(stderr)
		done(err)
	})
})

gulp.task('watch', done => {
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

gulp.task('compile', gulp.parallel('watch', 'webpack', 'browserify'))

gulp.task('default', gulp.series('set_dev_env', 'compile'))
gulp.task('build', gulp.series('set_prod_env', 'compile'))
