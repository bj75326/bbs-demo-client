import React, {Component} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import Login from '../../components/Login';
import {Alert, Row, Col} from 'antd';
import {prefix} from '../../common/setup';

import styles from './Login.less';

const {UserName, Password, Submit} = Login;

@connect(({login, loading}) => ({
  login, 
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  
  handleSubmit = (errs, values) => {
    if(!errs){
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
        }
      });
    }
  }

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });  
  }
  
  renderMessage = content => {
    return (
      <Alert style={styles.alert} message={content} type="error" showIcon/>  
    );
  }

  render(){
    const {login, submitting} = this.props;
    return (
      <div className={styles.main}>
        <Login
          onSubmit={this.handleSubmit}
        >
          {
            login.status === 'error' &&
            !submitting && this.renderMessage('UserName or Password incorrect!')
          } 
          <UserName name="userName" placeholder="admin/user"/>
          <Password name="password" placeholder="888888/123456"/>
          <Submit loading={submitting} className={`${prefix}-btn`}>Login</Submit>
          <div className={styles.other}>
            <Row>
              <Col span={12} className={styles.left}>
                <Link to="">Forget your password?</Link>    
              </Col>
              <Col span={12} className={styles.right}>
                <Link to="/user/register">Sign up</Link>
              </Col>    
            </Row>
          </div>
        </Login>
      </div>
    );
  }
} 