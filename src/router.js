import React from 'react';
import {routerRedux, Route, Switch} from 'dva/router';
import {LocaleProvider, Spin} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import dynamic from 'dva/dynamic';
import {getRouterData} from './common/router';
import Authorized from './utils/Authorized';
import styles from './index.less';

const {ConnectedRouter} = routerRedux;
const {AuthorizedRoute} = Authorized;

dynamic.setDefaultLoadingComponent(() => (
  <div style={{
    width: '100%',
    height: '100%',
    margin: 'auto',
    paddingTop: 50,
    textAlign: 'center'
  }}>
    <Spin size="large" className={styles.globalSpin}/>
  </div>
));

function RouterConfig({history, app}){
  
  const routerData = getRouterData(app);
  const BasicLayout = routerData['/'].component;
  const UserLayout = routerData['/user'].component;
  const EditorLayout = routerData['/topic/create'].component;
  
  //论坛首页内容应该不是强制登录才能看到的。
  return (
    <LocaleProvider locale={enUS}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route
            path="/user"
            component={UserLayout}
          />
          <AuthorizedRoute
            path="/topic/create"
            render={props => <EditorLayout {...props}/>}
            authority={['user', 'admin']}
            redirectPath="/user/login"
          />
          <AuthorizedRoute
            path="/"
            render={props => <BasicLayout {...props}/>}
            authority={null}
            redirectPath="/user/login"
          />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
  
}

export default RouterConfig;
