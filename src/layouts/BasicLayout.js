import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {Layout, Spin} from 'antd';
import DocumentTitle from 'react-document-title';
import {connect} from 'dva';
import {Route, Redirect, Switch, routerRedux} from 'dva/router';
import {ContainerQuery} from 'react-container-query';
import classNames from 'classnames';
import {enquireScreen} from 'enquire-js';
import Authorized from '../utils/Authorized';
import {getMenuData} from '../common/menu';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import {current} from '../components/Authorized';
import RmcDrawer from 'rmc-drawer';
import NavbarMenu from '../components/NavbarMenu';
import {prefix} from '../common/setup';
import {getRoutes} from '../utils/utils';
import NotFound from '../routes/Exception/404';

import logo from '../assets/logo.svg';

//import 'rmc-drawer/assets/index.css';

const {Content, Header, Footer} = Layout;
const {AuthorizedRoute} = Authorized;

const copyright = <Fragment>Copyright <i className="iconfont icon-copyright"/> 2018 Bill Ji</Fragment>;

/**
 * 获取menuData需要的重定向
 * 父级路径需要重定向到子级路径中的第一个(默认)
 */
const redirectData = [];
const getRedirect = item => {
  if(item && item.children){
    if(item.children[0] && item.children[0].path){
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  }
};

let isMobile, isSmallScreen;
enquireScreen(b => {  //  <=768px
  isMobile = b;
});
enquireScreen(b => {  //  <=1199px
  isSmallScreen = b;  
}, "screen and (max-width:1199px)");

//test
/*
enquireJs.register("screen and (max-width:1199px)", {
  match: () => {
    console.log('1199px matched');
  },

  unmatch: () => {
    console.log('1199px unmatched');
  }
});
enquireJs.register("screen and (max-width:800px)", {
  match: () => {
    console.log('800px matched');
  },

  unmatch: () => {
    console.log('800px unmatched');
  }
});*/


class BasicLayout extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      isMobile,
      isSmallScreen,
    };
  }

  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
    isMobile: PropTypes.bool,
    isSmallScreen: PropTypes.bool,
  }
  
  getChildContext(){
    const {location, routerData} = this.props;
    const {isMobile, isSmallScreen} = this.state;
    return {
      location,
      breadcrumbNameMap: routerData,
      isMobile,
      isSmallScreen,
    };
  }

  componentDidMount(){
    console.log('basiclayout componentDidMount');
    enquireScreen(mobile => {
      console.log('mobile mode on', mobile);
      this.setState({
        isMobile: mobile,
      });
    });
    enquireScreen(smallScreen => {
      console.log("smallScreen mode on", smallScreen);
      this.setState({
        isSmallScreen: smallScreen,
      });
    }, "screen and (max-width:1199px)");
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
  }

  componentDidUpdate(){
    console.log('basiclayout componentDidUpdate');
  }
  componentWillUnmount(){
    console.log('basiclayout componentWillUnmount');
  }

  //登陆后的重定向
  getBashRedirect(){
    const urlParams = new URL(window.location.href);
    const redirect = urlParams.searchParams.get('redirect');
    if(redirect){
      //将url中的'redirect='拿掉
      urlParams.searchParams.delete('redirect');
      //这个时候原生history的改动能否触发router history的subscribe ??
      window.history.replaceState(null, 'redirect', urlParams.href);
    }else{
      //主页默认路径
      return '/forum/latest';
    }
    return redirect;
  }

  handleMenuCollapse = collapsed => {
    this.props.dispatch({
      type: 'global/changeCollapsed',
      payload: collapsed,
    });
  }

  handleMenuClick = ({key}) => {
    if(key === 'profile'){

    } 
    if(key === 'setting'){

    }
    if(key === 'logout'){
      this.props.dispatch({
        type: 'login/logout',
      });
    } 
  }

  handleNoticeVisibleChange = visible => {
    if(visible){
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  }

  routeToLogin = () => {
    this.props.dispatch(routerRedux.push('/user/login'));
  }

  routeToRegister = () => {
    this.props.dispatch(routerRedux.push('/user/register'));
  }

  getPageTitle = () => {
    const {routerData, location} = this.props;
    const {pathname} = location;  
    let title = 'bbs-demo';
    if(routerData[pathname] && routerData[pathname].name){
      title = `${routerData[pathname].name} - bbs-demo`;
    }
    return title;
  }

  render(){
    const {
      currentUser, fetchingNotices, notices, collapsed, routerData, match, location, accountLogout,
    } = this.props;

    const bashRedirect = this.getBashRedirect();
    const {isMobile, isSmallScreen} = this.state; 
    const sidebar = (
      <NavbarMenu
        isSmallScreen={true}
        menuData={getMenuData()}
        Authorized={Authorized}
        location={location}
        onCollapsed={this.handleMenuCollapse}
      />
    );

    const contentRoutes = (
      <Switch>
        {
          redirectData.map(item => (
            <Redirect key={item.from} exact from={item.from} to={item.to}/>
          ))   
        }
        {
          getRoutes(match.path, routerData).map(item => (
            <AuthorizedRoute
              key={item.key}
              path={item.path}
              component={item.component}
              exact={item.exact}
              authority={item.authority}
              redirectPath="/exception/403"
            />
          ))
        }
        <Redirect exact from="/" to={bashRedirect}/>
        <Route render={NotFound}/>
      </Switch> 
    );
    const layout = (
      <Layout className={`${prefix}-layout`}>
        <Header style={{boxShadow: collapsed ? '0 5px 20px 0px #eef2f5' : '0 0 0 0 #fff'}}>
          <GlobalHeader
            logo={logo}
            currentUser={currentUser}
            current={current}
            fetchingNotices={fetchingNotices}
            notices={notices}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            isMobile={isMobile}
            isSmallScreen={isSmallScreen}
            collapsed={collapsed}
            onCollapsed={this.handleMenuCollapse}
            location={location}
            //ant design pro 中传给SiderMenu的props
            Authorized={Authorized}
            menuData={getMenuData()}
            onLoginBtnClick={this.routeToLogin}
            onRegisterBtnClick={this.routeToRegister}
            onMenuClick={this.handleMenuClick}
          />      
        </Header>
        {isSmallScreen ? (
          <RmcDrawer
            sidebar={sidebar}
            open={!collapsed}
            position="top"
            enableDragHandle={false}
          >
            <Content>
              {contentRoutes}
            </Content>
            <Footer>
              <GlobalFooter copyright={copyright} style={{marginTop: '56px'}}/>
            </Footer>  
          </RmcDrawer>
        ) : (
          [
            <Content key="content">
              {contentRoutes}   
            </Content>,
            <Footer key="footer">
              <GlobalFooter copyright={copyright} style={{marginTop: '56px'}}/>
            </Footer>  
          ]
        )}            
      </Layout>
    );
    
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <Spin size="large" spinning={!!accountLogout}><div className={classNames(params)}>{layout}</div></Spin>}
        </ContainerQuery> 
      </DocumentTitle>
    );
  }
}

export default connect(({user, global, loading}) => ({
  currentUser: user.currentUser,
  fetchingNotices: loading.effects['global/fetchNotices'],  
  notices: global.notices,  
  collapsed: global.collapsed,
  accountLogout: loading.effects['login/logout'],
}))(BasicLayout);