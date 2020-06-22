import React from 'react';
import {current} from './index';
import PromiseRender from './PromiseRender';
import {Spin} from 'antd';

function isPromise(obj){
  return (
    !!obj && 
    (typeof obj === 'object') &&
    (typeof obj.then === 'function')
  );
}

/**
 * 通用权限检测方法
 * @param {权限判定标准 type: String | Array | Promise | Function} authority
 * @param {当前权限 type: String} currentAuthority
 * @param {权限检测通过渲染的组件} target
 * @param {权限检测未通过的渲染组件} Exception
 */
const checkPermissions = (authority, currentAuthority, target, Exception) => {
  //没有权限限制
  console.log('checkPermissions authority', authority);
  console.log('checkPermissions currentAuthority', currentAuthority);
  //console.log('target', target);
  if(!authority){
    return target;
  }
  
  //权限判定标准类型为数组 Array
  if(Array.isArray(authority)){
    if(authority.indexOf(currentAuthority) >= 0){
      return target;
    }
    return Exception;
  }

  //权限判定标准类型为字符串 String
  if(typeof authority === 'string'){
    if(authority === currentAuthority){
      return target;
    }
    return Exception;
  }

  //权限判定标准类型为 Promise
  if(isPromise(authority)){
    return <PromiseRender ok={target} error={Exception} promise={authority}/>
  }
  
  //权限判定标准类型为函数 Function
  if(typeof authority === 'Function'){
    try{
      const bool = authority(currentAuthority);
      if(bool){
        return target;
      }
      return Exception;
    }catch(error){
      throw error;
    }
  }

  throw new Error('checkPermissions occured unsupported parameters.');
};

export {checkPermissions};

class AuthorizedPromise extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      currentAuthority: isPromise(props.promise) ? null : props.promise,
      //currentAuthority: 'guest',
    };
  }
  
  componentDidMount(){
    if(isPromise(this.props.promise)){
      this.props.promise.then(({authority}) => {
        this.setState({
          currentAuthority: authority,
        })
      }).catch(error => {
        //todo: 获取权限失败的处理
        this.setState({
          currentAuthority: 'error',
        });
        //throw new Error('AuthorizedPromise occured error when get authority', error);
      });    
    }
  }

  render(){
    const {currentAuthority} = this.state;
    console.log('currentAuthority', currentAuthority);
    const {authority, ok, error} = this.props;
    return currentAuthority ? (
      checkPermissions(authority, currentAuthority, ok, error)
    ) : (
      <div style={{
        width: '100%',
        height: '100%',
        margin: 'auto',
        paddingTop: 50,
        textAlign: 'center'  
      }}>
        <Spin size="large"/>
      </div>
    );
  }
}

const checkMenuItems = (authority, target, Exception) => {
  return checkPermissions(authority, current.authority, target, Exception);
};

export {checkMenuItems};

const check = (authority, target, Exception) => {
  //当前currentAuthority为Promise时
  /*
  if(isPromise(current.authority)){
    return <AuthorizedPromise promise={current.authority} authority={authority} ok={target} error={Exception}/>
  }
  return checkPermissions(authority, current.authority, target, Exception);
  */
  return <AuthorizedPromise promise={current.authority} authority={authority} ok={target} error={Exception}/>
};

export default check;
