
//es6 配置
//todo: code split analysis

const path = require('path');
const {version} = require('./package.json');

export default {
  entry: {
    vendor: [
      'react',
      'react-dom',
    ],
    app: "./src/index.js",
  },
  outputPath: `./dist/${version}`,
  theme: './theme.config.js',
  extraBabelPlugins: [
    ["import", {"libraryName": "antd", "libraryDirectory": "es", "style": true}]
  ], 
  env: {
    development: {
      extraBabelPlugins: [
        "dva-hmr"
      ],
      html: {
        template: "./src/index.ejs",
        filename: "index.html",
      },
      publicPath: "/",
    },
    production: {
      html: {
        template: "./src/index.ejs",
        filename: "index.html",
        /*minify: {
          collapseWhitespace: true,    
        },*/  //后期可能需要改为jade/pug
      },
      publicPath: `/BBS-DEMO-CLIENT/dist/${version}`, //后期与后台一并部署时需要重新设置
    }, 
  },
  ignoreMomentLocale: true,
  browserslist: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
  commons: [
    {
      name: ['vendor'],
      minChunks: Infinity,
    },
  ],
  //disableDynamicImport: true,
  //disableCSSModules: true,
  hash: true,
  cssModulesExcludes: [
    '/src/icon/iconfont.css',
    '/src/common/animate.css',
  ]
};
