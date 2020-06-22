import React, {PureComponent} from 'react';
import {Menu} from 'antd';
import pathToRegexp from 'path-to-regexp';
import {Link} from 'dva/router';
import {urlToList} from '../utils/pathTools';
import styles from './index.less';
import {prefix} from '../../common/setup';

const {SubMenu} = Menu;

/**
 * 根据menusData中item的icon返回icon的vdom
 * icon可以string或者ReactNode
 */
const getIcon = icon => {
  if(typeof icon === 'string' && icon.indexOf('http') === 0){
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if(typeof icon === 'string'){
    return <i className={`icon-font icon-${icon}`}/>;
  }
  return icon;
};

/**
 * 使用path-to-regexp匹配path
 */
export const getMenuMatchKeys = (flatMenuKeys, path) => {
  return flatMenuKeys.filter(item => {
    return pathToRegexp(item).test(path);    
  });
};

export default class NavbarMenu extends PureComponent {
  constructor(props){
    super(props);
    this.menus = props.menuData;
    this.flatMenuKeys = this.getFlatMenuKeys(props.menuData);
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    };
  }

  //路由改变后Menu的openKeys应该做出相应的改变以保持同步
  componentWillReceiveProps(nextProps){
    if(nextProps.location.pathname !== this.props.location.pathname){
      this.setState({
        openKeys: this.getDefaultCollapsedSubMenus(nextProps),
      });
    }    
  }

  /**
   * 获取所有path，返回一个path的一维数组
   * [
   *  '/list/search/articles',
   *  '/list/search/projects',
   *  '/list/search/applications',
   *  '/list/search',
   *  '/list',
   *  ...
   * ]
   */
  getFlatMenuKeys(menus){
    let keys = [];
    menus.forEach(item => {
      if(item.children){
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      }
      keys.push(item.path);
    });
    return keys;
  }

  /**
   * 获取当前路径经过正则匹配转化成 openKeys
   * '/list/search/articles' 
   * =>
   * ['/list', '/list/search', '/list/search/articles']
   */
  getDefaultCollapsedSubMenus(props){
    const {location: {pathname}} = props || this.props;
    return urlToList(pathname)
      // ['/list', '/list/search', '/list/search/articles']
      .map(item => {
        return getMenuMatchKeys(this.flatMenuKeys, item)[0];
      })
      // path-to-regexp默认设置的匹配, end为true
      // ['/list', '/list/search', '/list/search/articles']
      .filter(item => item);
  }

  /**
   * 根据当前的路径获知当前被选择的menu 
   * '/list/search/articles' 
   * =>
   * ['/list', '/list/search', '/list/search/articles']
   */
  getSelectedMenuKeys(){
    const {location: {pathname}} = this.props;
    return urlToList(pathname).map(itemPath => {
      return getMenuMatchKeys(this.flatMenuKeys, itemPath).pop();
    });  
  }

  /**
   * 获取菜单Menu组件的children内容
   */
  getNavMenuItems(menusData){
    if(!menusData){
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        const ItemDom = this.getSubMenuOrItem(item);
        console.log('ItemDom', ItemDom);
        return this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => item);
  }

  /**
   * 根据menuData的item生成SubMenu组件或者Menu.Item组件的vdom结构
   * {
   *   name: 'Dashboard',
  *    icon: 'Dashboard',
  *    path: 'dashboard',
  *    authority: 'user',
  *    hideInMenu: false,
  *    children: [{
  *      ...
  *    }]   
   * }
   * =>
   * <SubMenu>...</SubMenu>
   * 或者
   * <Menu.Item>...</Menu.Item>
   */
  getSubMenuOrItem(item){
    if(item.children && item.children.some(child => child.name)){
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{item.name}</span>
              </span>    
            ) : (
              item.name
            )
          }
          key={item.path}
          className={`${prefix}-menu-submenu`}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }else{
      //console.log('item:', item);
      return (
        <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>
      );
    }
  }

  /**
   * 利用Authorized模块的的checkPermissions做权限判定
   * @param authority 当前menuItem(SubMenu或者MenuItem)的权限要求
   * @param ItemDom getSubMenuOrItem返回的vdom结构，权限判定通过进行渲染
   */
  checkPermissionItem(authority, ItemDom){
    if(this.props.Authorized && this.props.Authorized.checkMenuItems){
      const {checkMenuItems} = this.props.Authorized; 
      //console.log('call checkMenuiTEMS');
      return checkMenuItems(authority, ItemDom);     
    }
    return ItemDom;
  }

  /**
   * 转换item.path
   * 开头添加'/'，所有连续的'/'被替换成一个
   */
  conversionPath(path){
    if(path && path.indexOf('http') === 0){
      return path;
    }else{
      return `/${path || ''}`.replace(/\/+/g, '/');
    }
  }

  /**
   * 根据menusData的item(没有children)生成Menu.Item组件的children
   * 返回<a> 或者 <Link>
   */
  getMenuItemPath(item){
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const {target, name} = item;
    //如果item.path是http(s) link
    if(/^https?:\/\//.test(itemPath)){
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === this.props.location.pathname}
        onClick={
          this.props.isSmallScreen
          ? () => {
            this.props.onCollapsed(true);    
          } : undefined
        }
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  }

  handleOpenChange = openKeys => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const isMainMenu = this.menus.some(item => (
      lastOpenKey && (item.key === lastOpenKey || item.path === lastOpenKey)
    ));
    this.setState({
      openKeys: isMainMenu ? [lastOpenKey] : [...openKeys],
    });
  }

  render(){
    const {isSmallScreen} = this.props;
    const {openKeys} = this.state;

    //根据pathname获取当前选中项
    let selectedKeys = this.getSelectedMenuKeys();
    if(!selectedKeys.length){
      selectedKeys = [openKeys[openKeys.length-1]];
    }

    return isSmallScreen ? (
      <Menu
        key="Menu"
        mode="inline" 
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        className={`${prefix}-menu`}
        onOpenChange={this.handleOpenChange}
      >
        {this.getNavMenuItems(this.menus)}
      </Menu>
    ) : (
      <Menu
        key="Menu"
        mode="horizontal"
        selectedKeys={selectedKeys}
        className={`${prefix}-menu`}
      >
        {this.getNavMenuItems(this.menus)}
      </Menu>
    );
  }
}

