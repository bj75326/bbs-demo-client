import React, {Component} from 'react';
import {Tabs, Dropdown, Menu, Button} from 'antd';
import styles from './index.less';
import {prefix} from '../../common/setup';
import classNames from 'classnames';

const {TabPane} = Tabs;

const dropdownMap = {
  '/forum/latest': 'Latest first',
  '/forum/hottest': 'Hottest first',
  '/forum/following': 'Following',
};

export default class HomeHeader extends Component {

  simulateSelectOption = () => {
    const {selectedKeys} = this.props;
    return Object.keys(dropdownMap).filter(item => {
      return selectedKeys.some(key => key === item);
    });      
  }

  render(){
    const {isMdMax, listStyle, selectedKeys, toggleListStyle, handleTabChange, 
      handleMenuClick, } = this.props;
    const options = this.simulateSelectOption();
    const activeKeyProps = {
      activeKey: options[0],
      defaultActiveKey: Object.keys(dropdownMap)[0], 
    };

    const menu = (
      <Menu className={styles.menu} selectedKeys={selectedKeys} selectable onClick={handleMenuClick}>
        {Object.keys(dropdownMap).map(item => {
          return (
            <Menu.Item key={item}>
              <span>{dropdownMap[item]}</span>
              {options.indexOf(item) >= 0 && <i className="iconfont icon-right1"/>}
            </Menu.Item>
          );
        })}
      </Menu>  
    );

    return (
      <div className={styles.contentHeader}>
        {isMdMax ? (
          <Tabs 
            onChange={handleTabChange} 
            className={classNames(`${prefix}-tabs`, styles.tabs)} 
            {...activeKeyProps}
          >
            {Object.keys(dropdownMap).map(item => {
              return (
                <TabPane tab={dropdownMap[item]} key={item}/>
              );
            })}      
          </Tabs>
        ) : (
          <Dropdown overlay={menu} overlayClassName={`${prefix}-dropdown`}>
            <Button className={`${prefix}-btn ${styles.headerBtn}`}>
              {dropdownMap[options[0]]}
              <i className="iconfont icon-down1"/>
            </Button>
          </Dropdown>    
        )}
        <div className={styles.listStyle} onClick={toggleListStyle}>
          {listStyle === 'card' && <i className="iconfont icon-list1"/>}
          {listStyle === 'list' && <i className="iconfont icon-list"/>}  
        </div>
      </div>
    );
  }
}