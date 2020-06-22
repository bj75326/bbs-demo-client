import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Switch, routerRedux, Route} from 'dva/router';
import styles from './Home.less';
import classNames from 'classnames';
import {getRoutes} from '../../utils/utils';
import {enquireScreen, unenquireScreen} from 'enquire-js';
import pathToRegexp from 'path-to-regexp';
import HomeHeader from '../../components/HomeHeader';
import HomeSider from '../../components/HomeSider';

let isMdMax, enquireHandler;

enquireScreen(b => {
  isMdMax = b;
}, "screen and (max-width:991px)");

const urlToList = url => {
  const urlList = url.split('/').filter(i => i);
  return urlList.map((urlItem, index) => {
    return `/${urlList.slice(0, index + 1).join('/')}`;
  });
};

const getMenuMatchKeys = (routerDataKeys, path) => {
  return routerDataKeys.filter(item => {
    return pathToRegexp(item).test(path);
  });
};

@connect(({home, boards}) => ({
  carouselList: home.carouselList,
  boardList: boards.boardList,
  listStyle: home.listStyle,  
}))
export default class Home extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      isMdMax,
      selectedKeys: this.getSelectedMenuKeys(props),
    }; 
  }

  getSelectedMenuKeys(props){
    const {location: {pathname}, routerData} = props;
    return urlToList(pathname).map(itemPath => {
      return getMenuMatchKeys(Object.keys(routerData), itemPath).pop();
    }).filter(i => i);
  }

  componentDidMount(){
    console.log('home componentDidMount');
    enquireHandler = enquireScreen(mdMax => {
      console.log('mdMax mode on: ', mdMax);
      this.setState({isMdMax: mdMax});
    }, "screen and (max-width:991px)");
  }

  componentWillUnmount(){
    console.log('home componentWillUnmount');
    unenquireScreen(enquireHandler, "screen and (max-width:991px)");
    console.log('home componentWillUnmount end');
  }
  componentDidUpdate(){
    console.log('home componentDidUpdate');
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.location.pathname !== this.props.location.pathname){
      this.setState({
        selectedKeys: this.getSelectedMenuKeys(nextProps),
      });
    }
  }
  
  handleNewTopicBtnClick = () => {
    this.props.dispatch(routerRedux.push('/topic/create'));
  }

  handleMenuClick = ({key}) => {
    const {dispatch, match} = this.props; 
    console.log('match', match)
    if(key === '/forum/latest'){
      dispatch(routerRedux.push(`${match.url}/latest`));
    }
    if(key === '/forum/hottest'){
      dispatch(routerRedux.push(`${match.url}/hottest`));
    }
    if(key === '/forum/following'){
      dispatch(routerRedux.push(`${match.url}/following`));
    }
  }

  toggleListStyle = () => {
    const {listStyle} = this.props;
    if(listStyle === 'card'){
      this.props.dispatch({
        type: 'home/toggleListStyle',
        payload: 'list',
      });
    }
    if(listStyle === 'list'){
      this.props.dispatch({
        type: 'home/toggleListStyle',
        payload: 'card',
      })
    }
  }

  handleTabChange = (key) => {
    const {dispatch, match} = this.props;
    switch(key){
      case '/forum/latest':
        dispatch(routerRedux.push(`${match.url}/latest`));
        break;
      case '/forum/hottest':
        dispatch(routerRedux.push(`${match.url}/hottest`));
        break;
      case '/forum/following':
        dispatch(routerRedux.push(`${match.url}/following`));
        break;
      default:
        break;
    } 
  }

  render(){
    console.log('home render');
    const {carouselList, boardList, listStyle, routerData, match} = this.props;
    const {isMdMax, selectedKeys} = this.state;

    return (
      <div className={classNames('container', styles.container)}>
        <HomeSider
          wrapperCls={styles.sider}
          carouselList={carouselList}
          boardList={boardList}
          onNewTopicBtnClick={this.handleNewTopicBtnClick}   
        />
        <div className={styles.content}>
          <HomeHeader
            isMdMax={isMdMax}
            listStyle={listStyle}
            selectedKeys={selectedKeys}
            toggleListStyle={this.toggleListStyle}
            handleTabChange={this.handleTabChange}
            handleMenuClick={this.handleMenuClick}
          />
          <Switch>
            {
              getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))
            }
          </Switch>        
        </div>
      </div>
    );
  }
}