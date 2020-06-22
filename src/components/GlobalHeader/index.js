import React, {PureComponent, Fragment} from 'react';
import {routerRedux} from 'dva/router';
import {Menu, Tag, Divider, Dropdown, Avatar, Spin, Button} from 'antd';
import NavbarMenu from '../NavbarMenu';
import Navbar from '../Navbar';
import MobileSearch from '../MobileSearch';
import moment from 'moment';
import HeaderSearch from '../HeaderSearch';
import NoticeIcon from '../NoticeIcon';
import EmailIcon from '../EmailIcon';
import groupBy from 'lodash/groupBy';
import {Link} from 'dva/router';
import {prefix} from '../../common/setup';

import styles from './index.less';

export default class GlobalHeader extends PureComponent {

  /**
   * 处理从后台获取的notices数据
   * 获取的notice数据结构: 
   * {
   *    id: '000000001',
   *    type: 'General', 'General' || 'Comment' || 'Follow' 
   *    avatar: '',
   *    title: '',
   *    description: '',
   *    datetime: '',  
   *    status: '',
   *    extra: '',
   * }
   */
  getNoticeData(){
    const {notices = []} = this.props;
    if(notices.length === 0){
      return [];
    }
    const newNotices = notices.map(notice => {
      const newNotice = {...notice};  
      if(newNotice.datetime){
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if(newNotice.id){
        newNotice.key = newNotice.id;    
      }
      //extra & status 借鉴ant design pro的设计，本项目暂时保留
      if(newNotice.extra && newNotice.status){
        const color = ({
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',     
        })[newNotice.status];
        newNotice.extra = <Tag color={color} style={{}}>{newNotice.extra}</Tag>;
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  render(){
    const {
      currentUser, current, collapsed, fetchingNotices, notices, isMobile, isSmallScreen,
      logo, onMenuClick, Authorized, menuData, onCollapsed, location,
      onNoticeVisibleChange, onLoginBtnClick, onRegisterBtnClick,
    } = this.props;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="profile"><i className="iconfont icon-profile"/><span>Profile</span></Menu.Item>
        <Menu.Item key="setting" disabled><i className="iconfont icon-sinaweibo18"/><span>Setting</span></Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="logout" ><i className="iconfont icon-tuichu"/><span>Logout</span></Menu.Item>
      </Menu>
    );  

    const noticeData = this.getNoticeData();

    return (
      <div className={styles.header}>
        <Link to="/" className={styles.logo} key="logo">
          <img src={logo} alt="logo" width="32"/>
          {isMobile || <h1>BBS Demo</h1>}
        </Link>
        {isSmallScreen ? (
          <Fragment>
            <Divider type="vertical" key="line"/>
            <Navbar collapsed={collapsed} onCollapsed={onCollapsed} key="navbar"/>
          </Fragment>    
        ) : (
          <NavbarMenu
            key="menu"
            isSmallScreen={false}
            menuData={menuData}
            Authorized={Authorized}
            location={location}
          />
        )}
        <div className={styles.right}>
          {isMobile ? <MobileSearch className={styles.action}/> : 
            <HeaderSearch
              className={styles.search}
              placeholder="Search the forum" 
              dataSource={['1', '2', '3']}
              isMobile={isMobile}
              onSearch={value => {
                console.log('search input: ', value); // eslint-disable-line
              }}
              onPressEnter={value => {
                console.log('search enter:', value); // eslint-disable-line
              }} 
            />
          }
          {['admin', 'user'].indexOf(current.authority) >= 0 ? (
            <Fragment>
              <NoticeIcon
                className={`${styles.action}`}
                count={currentUser.notifyCount}
                onItemClick={item => {
                  console.log('notice item: ', item ); // eslint-disable-line
                }}
                onPopupVisibleChange={onNoticeVisibleChange}
                loading={fetchingNotices}
                popupAlign={{offsets: [20, -16]}}   
              >
                <NoticeIcon.Tab
                  list={noticeData['General']}
                  title={<i className="iconfont icon-tongzhi"/>}
                  emptyText="No Messages yet"
                  emptyImage={<i className="iconfont icon-empty"/>}
                />
                <NoticeIcon.Tab
                  list={noticeData['Comment']}
                  title={<i className="iconfont icon-comment"/>}
                  emptyText="No Comments yet"
                  emptyImage={<i className="iconfont icon-empty"/>}
                />
                <NoticeIcon.Tab
                  list={noticeData['Follow']}
                  title={<i className="iconfont icon-follow"/>}
                  emptyText="No Messages yet"
                  emptyImage={<i className="iconfont icon-empty"/>}
                />  
              </NoticeIcon>
              <EmailIcon
                className={`${styles.action}`}
                count={currentUser.emailCount}
                location={location}
              />
              {currentUser.name ? (
                <Dropdown overlay={menu} overlayClassName={`${prefix}-dropdown`} placement="bottomRight" trigger={['hover', 'click']}>
                  <span className={`${styles.action} ${styles.account}`}>
                    <Avatar className={styles.avatar} src={currentUser.avatar}/>
                    {isMobile || <i className="iconfont icon-down1"/>}
                  </span>  
                </Dropdown>    
              ) : <Spin size="small" style={{marginLeft: 8}}/>}   
            </Fragment>  
          ) : (
            <Fragment>
              <Button className={`${prefix}-btn`} onClick={onLoginBtnClick}>
                {isMobile || <i className="iconfont icon-login"/>}
                <span>Login</span>
              </Button>
              <Button className={`${prefix}-btn`} type="primary" onClick={onRegisterBtnClick}>
                {isMobile || <i className="iconfont icon-zhuce"/>}
                <span>Register</span>  
              </Button>
            </Fragment>    
          )}
        </div>
      </div>
    );
  }
} 
