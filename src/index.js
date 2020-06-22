import dva from 'dva';
import '@babel/polyfill';
import FastClick from 'fastclick';
import createLoading from 'dva-loading';
import createHistory from 'history/createBrowserHistory';

import './index.less';
import './icon/iconfont.css';
import './common/animate.css';

// 1. Initialize
const app = dva({
  history: createHistory(),
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

FastClick.attach(document.body);

export default app._store;  //eslint-disable-line
