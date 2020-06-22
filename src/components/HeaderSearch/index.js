import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {AutoComplete, Input} from 'antd';
import {prefix} from '../../common/setup';

import styles from './index.less';

export default class HeaderSearch extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      searchMode: false,
      value:  '',
    };
  }

  componentWillUnmount(){
    clearTimeout(this.timeout);
  }

  enterSearchMode = () => {
    this.setState({
      searchMode: true,
    }, () => {
      if(this.state.searchMode){
        this.input.focus();
      }
    });  
  }

  leaveSearchMode = () => {
    this.setState({
      searchMode: false,
      value: '',
    });
  }

  onChange = value => {
    this.setState({value});
    if(this.props.onChange){
      this.props.onChange(value);
    }
  }

  onKeyDown = e => {
    if(e.key === 'Enter'){
      this.timeout = setTimeout(() => {
        this.props.onPressEnter(this.state.value);
      }, 0);
    }
  }

  render(){
    const {className, placeholder, isMobile, ...restProps} = this.props;
    const wrapperClass = classNames({
      [className]: !!className,
      [styles.headerSearch]: !!styles.headerSearch,
      [styles.mobileSearch]: isMobile,
    });
    const inputClass = classNames({
      [styles.input]: !!styles.input,
      [styles.show]: this.state.searchMode,
    });
    return (
      <span
        className={wrapperClass}
        onClick={this.enterSearchMode} 
      >
        <AutoComplete
          key="AutoComplete"
          {...restProps}
          className={inputClass}
          dropdownClassName={`${prefix}-select-dropdown`}
          value={this.state.value}
          onChange={this.onChange}
        >
          <Input
            placeholder={placeholder} 
            ref={node => {this.input = node}}
            onKeyDown={this.onKeyDown}
            onBlur={this.leaveSearchMode}
            suffix={<i className="iconfont icon-search"/>}
          />
        </AutoComplete>
      </span>
    );
  }
}