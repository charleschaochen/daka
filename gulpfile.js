/**
 * Created by charles on 15/9/27.
 */

var gulp = require('gulp');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var rev = require('gulp-rev');
var revc = require('gulp-rev-collector');
var clean = require('gulp-clean');
var minHtml = require('gulp-minify-html');
var package = require('./package.json');

var jsFilter = filter('**/*.js', {restore: true});
var cssFilter = filter('**/*.css', {restore: true});

// 清理编译路径目录
gulp.task('clean', function () {
    return gulp.src(package.path.dist).pipe(clean({read: false, force: true}));
});

// 处理js脚本文件，压缩，加MD5缀
gulp.task('process-js', ['clean'], function () {
    return gulp.src(package.path.script)
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(rev())
        .pipe(jsFilter.restore)
        .pipe(gulp.dest(package.path.dist + '/' + package.path.distScript))
        .pipe(rev.manifest())
        .pipe(gulp.dest(package.path.dist + '/rev/' + +package.path.distScript));
});

// 为图片加MD5后缀
gulp.task('process-img', ['clean'], function () {
    return gulp.src(package.path.image)
        .pipe(rev())
        .pipe(gulp.dest(package.path.dist + '/' + package.path.distImage))
        .pipe(rev.manifest())
        .pipe(gulp.dest(package.path.dist + '/rev/' + +package.path.distImage));
});


// 处理css样式文件，压缩，加MD5缀
gulp.task('process-css', ['clean'], function () {
    return gulp.src(package.path.style).pipe(cssFilter)
        .pipe(csso())
        .pipe(rev())
        .pipe(cssFilter.restore)
        .pipe(gulp.dest(package.path.dist + '/' + package.path.distStyle))
        .pipe(rev.manifest())
        .pipe(gulp.dest(package.path.dist + '/rev/' + +package.path.distStyle));
});


// 修改html文件中的脚本和样式文件引用路径，以及css文件图片的引用
gulp.task('change-ref', ['process-js', 'process-img', 'process-css'], function () {
    // 修改html中的静态文件引用
    gulp.src([package.path.dist + '/rev/**/rev-manifest.json', './**/*.html'])
        .pipe(revc({
            replaceReved: true
        }))
        .pipe(minHtml({
            empty: true,
            spare: true
        }))
        .pipe(gulp.dest(package.path.dist + '/'));
    // 修改css文件中图片的引用
    gulp.src([package.path.dist + '/rev/' + package.path.distImage + '/rev-manifest.json', package.path.dist + '/css/**/*.css'])
        .pipe(revc({
            replaceReved: true
        }))
        .pipe(gulp.dest(package.path.dist + '/css'));
});

// 将工程下其他必要的文件目录也打包到发布目录下
gulp.task('pack-others', ['clean', 'change-ref'], function () {
    gulp.src('lib/**').pipe(gulp.dest(package.path.dist + '/lib'));
    gulp.src(package.path.dist + '/node_modules').pipe(clean({read: false, force: true}));
});

// 默认task
gulp.task('default', ['clean', 'process-js', 'process-css', 'process-img', 'change-ref', 'pack-others']);