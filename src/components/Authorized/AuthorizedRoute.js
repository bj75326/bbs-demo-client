import React from 'react';
import {Route, Redirect} from 'dva/router';
import Authorized from './Authorized';

class AuthorizedRoute extends React.Component {
  //封装props传递给Authorized组件

  render(){
    console.log('authorizedRoute path: ', this.props.path);

    const {
      component: Component,
      render,
      authority,
      redirectPath,
      ...rest
    } = this.props;

    return (
      <Authorized
        authority={authority}
        noMatch={
          <Route
            {...rest}
            render={() => <Redirect to={{pathname: redirectPath}}/>}
          />
        }
      >
        <Route
          {...rest}
          render={props => 
            (Component ? <Component {...props}/> : render(props))
          } 
        />
      </Authorized>
    );
  }
}

export default AuthorizedRoute;