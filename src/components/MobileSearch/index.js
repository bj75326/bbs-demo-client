import React, {PureComponent} from 'react';
import classNames from 'classnames';
import {Modal} from 'antd';
import SearchBar from './SearchBar';

import styles from './index.less';
import Search from 'antd/lib/transfer/search';

export default class MobileSearch extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
    };
  }  

  showMobileSearch = () => {
    this.setState({
      visible: true,
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    }, () => {
      console.log(this.state.visible);
    });
  }

  componentDidUpdate(){   
    if(this.state.visible && this.autoFocusInst){
      this.autoFocusInst.focus();
    }
  }

  render(){
    const {className} = this.props;
    const searchIconClass = classNames({
      [className]: !!classNames,
      [styles.searchIcon]: !!styles.searchIcon,
    });
    return [
      <span key="searchIcon" className={searchIconClass} onClick={this.showMobileSearch}>
        <i className={`iconfont icon-search ${styles.icon}`}/>
      </span>,
      <Modal
        key="searchModal"
        wrapClassName={styles.wrap}
        visible={this.state.visible}
        footer={null}
        closable={false}
        onOk={this.handleCancel}
        onCancel={this.handleCancel}
        maskClosable={false}
        transitionName=""
        maskTransitionName=""
        maskStyle={{backgroundColor: 'rgba(0, 0, 0, 0.4)'}}
      >
        <SearchBar
          placeholder="Search the forum"
          cancelText="Cancel"
          onCancel={this.handleCancel}
          ref={ref => this.autoFocusInst = ref}
          focusAfterMount
        />
      </Modal>
    ];
  }
}