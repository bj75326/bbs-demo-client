import React from 'react';
import {Input} from 'antd';
import styles from './index.less';
import {prefix} from '../../common/setup';

const map = {
  UserName: {
    component: Input,
    props: {
      prefix: <i className="iconfont icon-login"/>,
      placeholder: 'admin',
      className: 'bd-input-affix-wrapper',
    },
    rules: [{
      required: true, message: 'Account name required!',
    }],
  },
  Password: {
    component: Input,
    props: {
      prefix: <i className="iconfont icon-password1"/>,
      type: 'password',
      placeholder: '888888',
      className: 'bd-input-affix-wrapper',
    },
    rules: [{
      required: true, message: 'Password required!',
    }],
  },  
};

export default map;