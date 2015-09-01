fis.set('project.ignore', [
    '.idea/**',
    '.git/**',
    '.gitignore',

    'output/**',
    'play/**'
]);

fis.match('**', {
    release: '/o2o/lvsheng/$0',
    url: '/~lvsheng/o2o/lvsheng/$0'
});

//fis.config.set('modules.postpackager', 'autoload');
//fis.config.set('settings.postpackager.autoload.type', 'requirejs');
//fis.config.set('modules.postprocessor.js', 'amd');
//// 使用 depscombine 是因为，在配置 pack 的时候，命中的文件其依赖也会打包进来。
//fis.config.set('modules.packager', 'depscombine');
//fis.config.set('pack', {
//    'boost.js': [
//        'boost/*.js'
//    ]
//});
//fis.config.set('settings.postprocessor.amd', {
//    baseUrl: '.',
//    paths: {},
//    // 查看：https://github.com/amdjs/amdjs-api/blob/master/CommonConfig.md#packages-
//    // 不同的是，这是编译期处理，路径请填写编译路径。
//    packages: [
//        {
//            name: 'boost',
//            location: 'boost/',
//            main: 'xml'
//        }
//    ]
//});

//fis.match('**', {
//    deploy: fis.plugin('http-push', {
//        receiver: 'http://fedev.baidu.com/~lvsheng/fis-receiver.php',
//        to: '/home/lvsheng/public_html'
//    })
//});
