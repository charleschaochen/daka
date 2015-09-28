/**
 * React自动化编译打包工具
 * Created by charles on 15/9/27.
 */
var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

var reactConf = require('./gulp-react-conf.js');
var compAppDir = reactConf.appDir;  // 组件应用入口文件目录

// 编译react组件
gulp.task('react-compiler', function () {
    if (reactConf.compApps) {
        for (var component in reactConf.compApps) {
            browserify(compAppDir + '/' + component)
                .transform(reactify)
                .bundle()
                .pipe(source(reactConf.compApps[component]))
                .pipe(gulp.dest(compAppDir));
        }
    }
});

// 监听组件变化，触发编译任务
gulp.task('watch', function () {
    gulp.watch('js/components/**/*.jsx', ['react']);
});

gulp.task('default', ['react-compiler', 'watch']);