/**
 * FIS发布构建脚本
 * Created by charles on 15/9/25.
 */

//// 启用 fis-spriter-csssprites 插件
//fis.match('::package', {
//    spriter: fis.plugin('csssprites')
//});
//// 对 CSS 进行图片合并
//fis.match('*.css', {
//    // 给匹配到的文件分配属性 `useSprite`
//    useSprite: true
//});

// 压缩js文件，添加md5后缀
fis.match('scripts/*.js', {
    // fis-optimizer-uglify-js 插件进行压缩，已内置
    optimizer: fis.plugin('uglify-js'),
    useHash: true
});

// 压缩css文件，添加md5后缀
fis.match('styles/*.css', {
    // fis-optimizer-clean-css 插件进行压缩，已内置
    optimizer: fis.plugin('clean-css'),
    useHash: true
});

// 压缩png图片
fis.match('images/*.png', {
    // fis-optimizer-png-compressor 插件进行压缩，已内置
    optimizer: fis.plugin('png-compressor')
});

// 所有图片添加md5后缀
fis.match('images/*.{png,jpg,gif}', {
    useHash: true
});