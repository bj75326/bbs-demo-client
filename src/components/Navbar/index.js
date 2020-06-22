import React from 'react';
//import Drawer from 'rc-drawer';
//import NavbarMenu from '../NavbarMenu';
import classNames from 'classnames';
//import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';

//import 'rc-drawe/assets/index.css';

export default class Navbar extends React.Component {
  
  toggle = () => {
    const {collapsed, onCollapsed} = this.props;  
    onCollapsed(!collapsed);
    //this.triggerResizeEvent();
  }

  //bbs-demo-client的菜单collpase不需要触发resize事件
  /*
  @Debounce(600)
  triggerResizeEvent(){ //eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }*/

  render(){
    const {collapsed} = this.props;
    const navbarClass = classNames({
      [styles.navbar]: true,
      [styles.collapsed]: !!collapsed,
    });

    return (
      <button 
        className={navbarClass}
        onClick={this.toggle}
        ariaExpanded={!!collapsed}
        type="button"
      >
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </button>
    );
  }
}