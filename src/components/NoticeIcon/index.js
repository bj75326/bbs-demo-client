import React, {PureComponent} from 'react';
import {Popover, Tabs, Badge, Spin} from 'antd';
import classNames from 'classnames';
import List from './NoticeList';
import {prefix} from '../../common/setup';

import styles from './index.less';

const {TabPane} = Tabs;

export default class NoticeIcon extends PureComponent {
  constructor(props){
    super(props);
    this.state = {};

    if(props.children && props.children[0]){
      this.state.tabType = props.children[0].props.title; 
    }
  }

  static defaultProps = {
    onItemClick: () => {},
    onPopupVisibleChange: () => {},
    onTabChange: () => {},
    onClear: () => {},
    loading: false,
    emptyImage: <i className={`iconfont icon-empty ${styles.empty}`}/>,
  };

  static Tab = TabPane;

  onTabChange = tabType => {
    this.setState({
      tabType,
    });    
    this.props.onTabChange(tabType);
  }

  onItemClick = (item, tabProps) => {
    this.props.onItemClick(item, tabProps);
  }

  getNotificationBox(){
    const {children, loading} = this.props;    
    if(!children){
      return null;
    }  
    const panes = React.Children.map(children, child => {
      /*const title = child.props.list && child.props.list.length > 0 ?
        [child.props.title, <span>{child.props.list.length}</span>] : child.props.title;*/
      const title = child.props.title;    
      return (
        <TabPane tab={title} key={child.props.title}>
          <List
            {...child.props}
            data={child.props.list}
            onClick={item => this.onItemClick(item, child.props)}
            title={child.props.title}
          />
        </TabPane>
      );
    });
    const tabsClassName = classNames(styles.tabs, `${prefix}-tabs`);
    return (
      <Spin spinning={loading} delay={0}>
        <Tabs className={tabsClassName} onChange={this.onTabChange}>
          {panes}
        </Tabs>
      </Spin>
    );
  }

  render(){
    const {className, count, popupAlign, onPopupVisibleChange} = this.props;
    const noticeButtonClass = classNames({
      [className]: !!className,
      [styles.noticeButton]: !!styles.noticeButton,
    });
    const notificationBox = this.getNotificationBox();
    const trigger = (
      <span className={noticeButtonClass}>
        <Badge dot count={count} offset={[3, -6]} className={`${prefix}-badge`}>
          <i className={`iconfont icon-wave ${styles.icon}`}/>
        </Badge>
      </span>
    );
    if(!notificationBox){
      return trigger;
    }
    const popoverProps = {};
    if('popoverVisible' in this.props){
      popoverProps.visible = this.props.visible;
    }  
    return (
      <Popover
        placement="bottomRight"
        content={notificationBox}
        popupClassName={styles.popover}
        trigger="click"
        arrowPointAtCenter
        popupAlign={popupAlign}
        onVisibleChange={onPopupVisibleChange}
        {...popoverProps}     
      >
        {trigger}
      </Popover>
    );
  }
}