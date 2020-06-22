import React, {Fragment} from 'react';
import {Link, Redirect, Switch, Route} from 'dva/router';
import DocumentTitle from 'react-document-title';
import GlobalFooter from '../components/GlobalFooter';
import {getRoutes} from '../utils/utils';

import logo from '../assets/logo.svg'; 
import styles from './UserLayout.less';

const copyright = <Fragment>Copyright <i className="iconfont icon-copyright"/> 2018 Bill Ji</Fragment>

export default class UserLayout extends React.PureComponent {
  
  getPageTitle(){
    const {routerData, location} = this.props;  
    const {pathname} = location;
    let title = 'bbs-demo';
    if(routerData[pathname] && routerData[pathname].name){
      title = `${routerData[pathname].name} - ${title}`;
    }
    return title;
  }

  componentWillUnmount(){
    console.log('userLayout will unmount');
  }

  componentDidUpdate(){
    console.log('userLayout did update');
  }
  
  render(){
    const {routerData, match} = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.log}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo}/>
                </Link>
              </div>
              <div className={styles.title}>Welcome to BBS Demo</div>
              <div className={styles.desc}>A simple forum UI design</div>  
            </div>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />  
              ))}    
            </Switch>
          </div>
          <GlobalFooter copyright={copyright} className={styles.footer}/>
        </div>
      </DocumentTitle>
    );
  }
}