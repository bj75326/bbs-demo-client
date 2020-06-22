import React from 'react';
import {Spin} from 'antd';

class PromiseRender extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      component: null,
    }
  }

  componentDidMount(){
    const ok = this.checkIsInstantiation(this.props.ok);
    const error = this.checkIsInstantiation(this.props.Exception);
    this.props.promise.then(() => {
      this.setState({
        component: ok,
      }).catch(() => {
        this.setState({
          component: error,
        });
      });
    });  
  }

  checkIsInstantiation(target){
    if(!React.isValidElement(target)){
      return target;
    }
    return () => target;
  }

  render(){
    const {component:Component} = this.props;
    return Component ? (
      <Component {...this.props}/>
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

export default PromiseRender;