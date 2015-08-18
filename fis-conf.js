fis.set('project.ignore', [
    '.idea/**',
    '.git/**',
    '.gitignore',

    'output/**',
    'play/**'
]);

fis.match('**.xml.ejs', {
    isHtmlLike: true
});

fis.match('**.less', {
    // fis-parser-less 插件进行解析
    parser: fis.plugin('less'),
    // 构建后被改为.css 文件
    rExt: '.css'
});

fis.match('**', {
    release: '/o2o/$0',
    url: '/~lvsheng/o2o/$0'
});

fis.match('{**.css,**.xml.ejs}', {
    release: false
});

fis.match('**', {
    deploy: fis.plugin('http-push', {
        receiver: 'http://fedev.baidu.com/~lvsheng/fis-receiver.php',
        to: '/home/lvsheng/public_html'
    })
});
