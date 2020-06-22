//iconfont的css文件不想通过css module load
//roadhog的配置不鼓励使用webpack.config.js
const webpack = require('webpack');

module.exports = (webpackConfig, env) => {
  
  webpackConfig.module.rules.map(item => {
    if(String(item.test) === '/\\.css$/' || String(item.test) === '/\\.less$/'){
      console.log(item.exclude.toString());
    }
  });
  return webpackConfig;
  
};
