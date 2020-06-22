import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TouchFeedback from 'rmc-feedback';
import {prefix} from '../../common/setup';

import styles from './SearchBar.less';

const getDataAttr = props => Object.keys(props).reduce((prev, key) => {
  if(
    key.substr(0, 5) === 'aria-' || 
    key.substr(0, 5) === 'data-' ||
    key === 'role'
  ){
    prev[key] = props[key];
  }
  return prev;
}, {});

const onNextFrame = cb => {
  if(window.requestAnimationFrame){
    return window.requestAnimationFrame(cb);
  }
  return setTimeout(cb, 1);
};

const clearNextFrameAction = nextFrameId => {
  if(window.cancelAnimationFrame){
    window.cancelAnimationFrame(nextFrameId);
  }
  clearTimeout(nextFrameId);
};

export default class SearchBar extends React.Component {
  constructor(props){
    super(props);
    let value;
    if('value' in props){
      value = props.value || '';
    }else if('defaultValue' in  props){
      value = props.defaultValue;
    }else{
      value = '';
    }
    this.state = {
      value,
      focus: false,
    };
  }

  static defaultProps = {
    prefixCls: `${prefix}-search`,
    placeholder: '',
    showCancelButton: false,
    disabled: false,
    focusAfterMount: false,
  };

  static propTypes = {
    defaultValue: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onClear: PropTypes.func,
    onCancel: PropTypes.func,
    focusAfterMount: PropTypes.bool,
  };

  componentDidMount(){
    if(this.props.focusAfterMount){
      this.focus();
    }
    if(this.rightBtnRef){
      const initBtn = window.getComputedStyle(this.rightBtnRef);
      this.rightBtnInitMarginleft = initBtn.marginLeft;
    }
    this.componentDidUpdate();
  }

  componentDidUpdate(){
    if(this.syntheticPhRef){
      if(this.inputContainerRef && this.inputContainerRef.className.indexOf(styles[`${this.props.prefixCls}-start`]) > -1){
        //[styles[`${prefixCls}-start`]]: !!(focus || (value && value.length > 0))
        if(this.syntheticPhContainerRef){
          const realWidth = this.syntheticPhContainerRef.getBoundingClientRect().width;
          this.syntheticPhRef.style.width = `${Math.ceil(realWidth)}px`;
        }
        if(!this.props.showCancelButton && this.rightBtnRef){
          this.rightBtnRef.style.marginRight = '0';
        }
      }else{
        this.syntheticPhRef.style.width = '100%';
        if(!this.props.showCancelButton && this.rightBtnRef){
          this.rightBtnRef.style.marginRight = `-${this.rightBtnRef.offsetWidth + (this.rightBtnInitMarginleft != null ?  parseInt(this.rightBtnInitMarginleft, 10) : 0)}px`;
        }
      }
    }
  }

  componentWillReceiveProps(nextProps){
    if('value' in nextProps && nextProps.value !== this.state.value){
      this.setState({
        value: nextProps.value,
      });
    }
  }

  componentWillUnmount(){
    if(this.onBlurTimeout){
      clearNextFrameAction(this.onBlurTimeout);
      this.onBlurTimeout = null;
    }
  }

  onSubmit = e => {
    e.preventDefault();
    if(this.props.onSubmit){
      this.props.onSubmit(this.state.value || '');
    }   
    if(this.inputRef){
      this.inputRef.blur();
    } 
  }

  onChange = e => {
    if(!this.state.focus){
      this.setState({
        focus: true,
      });
    }
    const value = e.target.value;
    if(!('value' in this.props)){
      this.setState({
        value,
      });
    }
    if(this.props.onChange){
      this.props.onChange(value);
    }
  }

  onFocus = () => {
    this.setState({
      focus: true,
    });
    this.firstFocus = true; //
    if(this.props.onFocus){
      this.props.onFocus();    
    }
  }

  focus = () => {
    if(this.inputRef){
      this.inputRef.focus();
    }
  }

  onBlur = () => {
    this.onBlurTimeout = onNextFrame(() => {
      if(!this.blurFromOnClear){  //如果是因为点击clear导致的blur, onBlur不需要改变focus的state    
        if(document.activeElement !== this.inputRef){
          this.setState({
            focus: false,
          });
        }
      }
      this.blurFromOnClear = false;
    });
    if(this.props.onBlur){
      this.props.onBlur();
    }
  }

  onClear = () => {
    this.doClear();
  }

  doClear = (blurFromOnClear = true) => {
    this.blurFromOnClear = blurFromOnClear;
    if(!('value' in this.props)){
      this.setState({
        value: ''
      });
    }
    if(this.props.onClear){
      this.props.onClear('');
    }
    if(this.props.onChange){
      this.props.onChange('');
    }
    if(this.blurFromOnClear){
      this.focus();
    }
  }

  onCancel = () => {
    this.doClear(false);
    if(this.props.onCancel){
      this.props.onCancel(this.state.value || '');
    }
  }

  render(){
    const {prefixCls, showCancelButton, disabled, placeholder, className, style,
       maxLength} = this.props;
    
    const {value, focus} = this.state;
    const wrapCls = classNames(styles[prefixCls], className, {
      [styles[`${prefixCls}-start`]]: !!(focus || (value && value.length > 0)),
    });
    const clearCls = classNames(styles[`${prefixCls}-clear`], {
      [styles[`${prefixCls}-clear-show`]]: !!(focus && value && value.length > 0),
    });
    const cancelCls = classNames(styles[`${prefixCls}-cancel`], {
      [styles[`${prefixCls}-cancel-show`]]: !!(
        showCancelButton ||
        focus || 
        (value && value.length > 0)
      ),
      [styles[`${prefixCls}-cancel-anim`]]: this.firstFocus,
    });

    return (
      <form
        onSubmit={this.onSubmit}
        className={wrapCls}
        style={style}
        ref={el => (this.inputContainerRef = el)}
        action="#"
      >
        <div className={styles[`${prefixCls}-input`]}>
          <div
            className={styles[`${prefixCls}-synthetic-ph`]}
            ref={el => (this.syntheticPhRef = el)}
          >
            <span
              className={styles[`${prefixCls}-synthetic-ph-container`]}
              ref={el => (this.syntheticPhContainerRef = el)}
            >
              <i className={styles[`${prefixCls}-synthetic-ph-icon`]}/>
              <span
                className={styles[`${prefixCls}-synthetic-ph-placeholder`]}
                style={{visibility: placeholder && !value ? 'visible' : 'hidden'}}
              >
                {placeholder}
              </span>
            </span>
          </div>
          <input
            type="search"
            className={styles[`${prefixCls}-value`]}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            onChange={this.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            ref={el => {this.inputRef = el}}
            maxLength={maxLength}
            {...getDataAttr(this.props)}
          />
          <TouchFeedback activeClassName={styles[`${prefixCls}-clear-active`]}>
            <a onClick={this.onClear} className={clearCls}/>
          </TouchFeedback>
        </div>
        <div
          className={cancelCls}
          onClick={this.onCancel}
          ref={el => {this.rightBtnRef = el}}
        >
          {this.props.cancelText}
        </div>
      </form>
    );
  }
}