import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux, Link} from 'dva/router';
import {Form, Select, Row, Col, Popover, Progress, Button, Input} from 'antd'; 
import styles from './Register.less';
import {prefix} from '../../common/setup';
import classNames from 'classnames';

const prefixCls = prefix;

const FormItem = Form.Item;
const {Option} = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: <div className={styles.success}>Strength: strong</div>,
  pass: <div className={styles.warning}>Strength: medium</div>,
  poor: <div className={styles.error}>Strength: too short</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',  
};

@connect(({register, loading}) => ({
  register,
  submitting: loading.effects['register/submit'],
  validating: loading.effects['register/checkNameUnique'],
}))
@Form.create()
export default class Register extends Component {
  state = {
    count: 0,
    confirmDirty: false,   
    visible: false,       //password popover
    help: '',             //password error message
    prefix: '86',  
  }


  componentWillUnmount(){
    clearInterval(this.interval);
  }

  checkName = (rule, value, callback) => {    
    if(!value){
      //name为假值
      callback('Please enter your username.');
    }else if(!/(^(?:[\u4e00-\u9fa5]+)(?:·[\u4e00-\u9fa5]+)*$)|(^[a-zA-Z]+[\.\-\_a-zA-Z]{0,1}[a-zA-Z]+$)/.test(value)){
      //name的格式判断  
      callback("Username should consist of alphanumeric characters, must begin with a letter, can be separated by a '_', '-' or '.'.");  
      
    }else{
      callback();
    }      
  }

  checkNameUnique = (rule, value, callback) => {
    //this.checkName(rule, value, callback);
    const errors = [];
    //onBlur的检测会把之前的error清空，需要先检测一次格式
    if(!value){
      errors.push('Please enter your username.');
    }else if(!/(^(?:[\u4e00-\u9fa5]+)(?:·[\u4e00-\u9fa5]+)*$)|(^[a-zA-Z]+[\.\-\_a-zA-Z]{0,1}[a-zA-Z]+$)/.test(value)){
      errors.push("Username should consist of alphanumeric characters, must begin with a letter, can be separated by a '_', '-' or '.'.");
    }
    if(errors.length <= 0){
      this.props.dispatch({
        type: 'register/checkNameUnique',
        payload: {
          value,
          callback,
        }
      });
    }else{
      callback(errors);
    }  
  }

  changePrefix = value => {
    this.setState({
      prefix: value,
    });
  }

  getPasswordStatus = () => {
    const {form} = this.props;
    const value = form.getFieldValue('password');
    if(value && value.length > 9){
      return 'ok';  
    }
    if(value && value.length > 5){
      return 'pass';
    }
    return 'poor';
  }

  renderPasswordProgress = () => {
    const {form} = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={classNames(styles.progress, `${prefixCls}-progress`)}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;  
  }

  checkPassword = (rule, value, callback) => {
    if(!value){
      this.setState({
        help: 'Please enter your password.',
        visible: !!value,  
      });
      callback('error');
    }else{
      this.setState({
        help: '',
      });
      if(!this.state.visible){
        this.setState({
          visible: !!value,
        });
      }
      if(value.length < 6){
        callback('error');
      }else{
        const {form} = this.props;
        if(value && this.state.confirmDirty){
          form.validateFields(['confirm'], {force: true});
        }
        callback();
      }
    } 
  }

  checkConfirm = (rule, value, callback) => {
    const {form} = this.props;
    if(value && value !== form.getFieldValue('password')){
      callback('The two password did not match.');
    }else{
      callback();
    }
  }

  onGetCaptcha = () => {
    let count = 59;
    this.setState({
      count,
    });  
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({
        count,
      });
      if(count === 0){
        clearInterval(this.interval);
      }
    }, 1000);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({force: true, firstFields: ['name']}, (err, values) => {
      if(!err){
        this.props.dispatch({
          type: 'register/submit',
          payload: {
            ...values,
            prefix: this.state.prefix,
          }
        });
      }
    });
  }

  render(){
    const {form, submitting} = this.props;
    const {getFieldDecorator, isFieldValidating} = form;
    const {count, prefix} = this.state;
    console.log('during render ', isFieldValidating('name'));
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem >
            {getFieldDecorator('name', {
              validate: [{
                trigger: 'onChange',
                rules: [{
                  validator: this.checkName,
                }],  
              }, {
                trigger: 'onBlur',
                rules: [{
                  validator: this.checkNameUnique,
                }],
              }]
            })(<Input className={`${prefixCls}-input`} placeholder="Name"/>)}  
          </FormItem>
          <FormItem>
            <InputGroup compact className={`${prefixCls}-input-group`}>
              <Select
                value={prefix}
                onChange={this.changePrefix}
                style={{width: '25%'}}
                className={`${prefixCls}-select`}
                dropdownClassName={`${prefixCls}-select-dropdown`}
              >
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
              </Select>
              {getFieldDecorator('mobile', {
                rules: [{
                  required: true,
                  message: 'Please enter your phone number.',
                }, {
                  pattern: /^1\d{10}$/,
                  message: 'Incorrectly formatted phone number.',
                }],
              })(
                <Input style={{width: '75%'}} className={`${prefixCls}-input`} placeholder="Phone number"/>
              )}
            </InputGroup>
          </FormItem>
          <FormItem help={this.state.help}>
            <Popover
              content={
                <div style={{}}>
                  {passwordStatusMap[this.getPasswordStatus()]} 
                  {this.renderPasswordProgress()}
                  <div style={{}}>
                    Please enter at least 6 characters and a complex password will make your account safer.
                  </div>   
                </div>
              }
              overlayStyle={{width: 240}}
              overlayClassName={`${prefixCls}-popover`}
              placement="right"
              visible={this.state.visible}
            >
              {getFieldDecorator('password', {
                rules: [{
                  validator: this.checkPassword,
                },]
              })(
                <Input type="password" className={`${prefixCls}-input`} placeholder="Password"/>
              )}
            </Popover>            
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [{
                required: true,
                message: 'Please enter your password again.'
              }, {
                validator: this.checkConfirm
              }]
            })(
              <Input type="password" className={`${prefixCls}-input`} placeholder="Confirm Password"/>
            )}
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('captcha', {
                  rules: [{
                    required: true,
                    message: 'Please enter the code.'  
                  }],
                })(
                  <Input className={`${prefixCls}-input`} placeholder="Verification code"/>
                )}
              </Col>
              <Col span={8}>
                <Button
                  disabled={count}
                  onClick={this.onGetCaptcha}
                  className={classNames(`${prefixCls}-btn`, styles.getCaptcha)}
                >
                  {count ? `${count} s` : 'Get code'}
                </Button>    
              </Col>
            </Row>    
          </FormItem>
          <FormItem>
            <Button
              loading={submitting}
              className={classNames(styles.submit, `${prefixCls}-btn`)}
              type="primary"
              htmlType="submit"
            >
              Register
            </Button>
          </FormItem>
          <div className={styles.other}>
            <Row>
              <Col span={12} className={styles.left}>
                <Link to="">Service agreement</Link>    
              </Col>
              <Col span={12} className={styles.right}>
                <Link to="/user/login">Already have an account?</Link>    
              </Col>
            </Row>          
          </div>
        </Form>
      </div>
    );
  }
}