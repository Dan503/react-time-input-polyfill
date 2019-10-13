var gulp = require('gulp')
var browserify = require('browserify')
// var babelify = require('babelify')
var uglify = require('gulp-uglify')
var buffer = require('vinyl-buffer')
var source = require('vinyl-source-stream')

gulp.task('browserify', done => {
	var b = browserify({
		entries: './timePolyfillHelpers.js',
		debug: true,
		// defining transforms here will avoid crashing your stream
		transform: ['babelify'],
	})

	return b
		.bundle()
		.pipe(source('timePolyfillHelpers.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest('./dist'))
})

gulp.task('default', gulp.series('browserify'))
