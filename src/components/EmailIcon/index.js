import React, {PureComponent} from 'react';
import {Badge} from 'antd';
import classNames from 'classnames';
import {Link} from 'dva/router';
import {prefix} from '../../common/setup';

import styles from './index.less'; 

export default class EmailIcon extends PureComponent {
  render(){
    const {className, count} = this.props; 
    const emailIconClass = classNames({
      [className]: !!className,
      [styles.emailButton]: !!styles.emailButton,
    }); 
    return (
      <Link
        to="/user/messages"
        replace={this.props.location.pathname === '/user/messages'}
        onClick={() => {
          console.log('message button clicked'); 
        }}
        className={emailIconClass}
      >
        <Badge dot count={count} offset={[3, -6]} className={`${prefix}-badge`}>
          <i className={`iconfont icon-email ${styles.icon}`}/>
        </Badge>
      </Link>
    );
  }
}