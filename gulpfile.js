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
	gulp.watch(['./timePolyfillHelpers.js', './index.js']).on('change', () => {
		exec(`npx rollup --config`, function (err, stdout, stderr) {
			console.log(stdout)
			console.log(stderr)
			done(err)
		})
	})
	done()
})

gulp.task('compile', gulp.parallel('webpack'))

gulp.task(
	'default',
	gulp.series('set_dev_env', gulp.parallel('watch', 'compile')),
)
gulp.task('build', gulp.series('set_prod_env', 'compile'))
