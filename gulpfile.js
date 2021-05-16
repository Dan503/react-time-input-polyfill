var gulp = require('gulp')
var exec = require('child_process').exec

var isProduction = () => process.env.NODE_ENV === 'production'

const setEnv = (env) => (done) => {
	process.env.NODE_ENV = env
	done()
}
gulp.task('set_dev_env', setEnv('development'))
gulp.task('set_prod_env', setEnv('production'))

gulp.task('webpack', (done) => {
	const command = isProduction() ? 'build' : 'start'
	exec(`npm run react-${command}`, function (err, stdout, stderr) {
		console.log(stdout)
		console.log(stderr)
		done(err)
	})
})

gulp.task('rollup', (done) => {
	exec(`npx rollup --config`, function (err, stdout, stderr) {
		console.log(stdout)
		console.log(stderr)
		done(err)
	})
})

gulp.task('watch', (done) => {
	gulp.watch('./src/time-polyfill/*.js').on('change', gulp.series('rollup'))
	done()
})

gulp.task('compile', gulp.parallel('webpack'))

gulp.task('copy-build-to-docs', () => {
	return gulp.src('./build/**/*').pipe(gulp.dest('docs'))
})

gulp.task(
	'default',
	gulp.series('set_dev_env', gulp.parallel('watch', 'compile')),
)
gulp.task('build', gulp.series('set_prod_env', 'compile', 'copy-build-to-docs'))
