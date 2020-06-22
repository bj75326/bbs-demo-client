import React from 'react';
import {Link} from 'dva/router';
import {Divider, Menu, Dropdown, Avatar, Tooltip, Modal, Popover, Button, Tag, Input} from 'antd';
import {prefix} from '../../common/setup';

import styles from './index.less';


const historyIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" className={styles.history} width="30px" height="30px">
    <path d="M8.047 17.106a6.462 6.462 0 1 0-1.953-5.124l1.081-.007a5.385 5.385 0 1 1 1.579 4.318l-.707.813z" fill="#555"></path>
    <path fill="#555" d="M6.885 14.615l1.884-3.23H5z"></path>
    <path d="M12.538 9.303v2.706m1.616 2.068l-1.42-1.867" fill="none" stroke="#555" strokeLinecap="round"></path>
  </svg>  
);

const info = {
  'init': 'Update will be autosaved',
  'succ': 'Autosave successfully',
  'err': 'Article synchronization failed',
  'wip': 'Saving...'
};

const successIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" className={styles.succ} width="12px" height="12px"><path d="M7 13c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm0-1c2.8 0 5-2.2 5-5S9.8 2 7 2 2 4.2 2 7s2.2 5 5 5zm2.2-8l.8.4L6.1 10 4 7l.7-.6L6.1 8l3.1-4z" fill="#7a9880"></path></svg>
);
const loadingIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" className={styles.loading} width="12px" height="12px"><path d="M2 7c0-2.8 2.2-5 5-5 1.5 0 2.8.7 3.7 1.7l-.8.5C9.1 3.5 8.1 3 7 3 4.8 3 3 4.8 3 7h1L2.5 9 1 7h1zm10 0c0 2.8-2.2 5-5 5-1.5 0-2.8-.7-3.7-1.7l.9-.5c.7.7 1.7 1.2 2.8 1.2 2.2 0 4-1.8 4-4h-1l1.5-2L13 7h-1z" fill="#ccc"></path></svg>
);
const offLineIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" className={styles.err} width="12px" height="12px">
    <g fill="#a5a5a5">
      <path d="M1.1 4.2C2.6 2.8 4.7 2 7 2c2.3 0 4.4.9 6 2.3l-.7.7C10.9 3.8 9 3 7 3s-3.9.8-5.3 2l-.6-.8zm2 2.3C4.1 5.6 5.5 5 7 5s2.9.6 4 1.5l-.7.7C9.4 6.5 8.3 6 7 6c-1.3 0-2.4.5-3.3 1.2l-.6-.7z" opacity=".3"></path>
      <path d="M5 8.7c.6-.4 1.3-.7 2-.7s1.4.3 2 .7l-2 2.2-2-2.2z"></path>
    </g>
  </svg>  
);
const errorIcon = (
  <svg width="12px" height="12px" viewBox="0 0 14 14" className={styles.err}>
    <g transform="translate(1.000000, 1.000000)" fill="#E95F5F">
        <path d="M6,11 C8.8,11 11,8.8 11,6 C11,3.2 8.8,1 6,1 C3.2,1 1,3.2 1,6 C1,8.8 3.2,11 6,11 Z M5.88735269,5.06239478 L3.82495791,3 L3,3.82495791 L5.06239478,5.88735269 L3,7.94974747 L3.82495791,8.77470538 L5.88735269,6.7123106 L7.94974747,8.77470538 L8.77470538,7.94974747 L6.7123106,5.88735269 L8.77470538,3.82495791 L7.94974747,3 L5.88735269,5.06239478 Z M6,12 C2.7,12 0,9.3 0,6 C0,2.7 2.7,0 6,0 C9.3,0 12,2.7 12,6 C12,9.3 9.3,12 6,12 Z"/>
    </g>
</svg>
);

const infoIcon = {
  'init': successIcon,
  'succ': successIcon,
  'err': errorIcon,
  'wip': loadingIcon
}

export default class EditorHeader extends React.PureComponent {

  constructor(props){
    super(props);
    
    this.state = {
      modalVisible: false,
      inputVisible: false,      
    };
  }

  handleSelectBoardBtnClick = e => {
    this.setState({
      modalVisible: true,
    });       
  }

  handleTagClose = tag => {
    const tags = this.props.topicTags.filter(t => t !== tag);  
    this.props.changeTopicTags(tags);
  }

  handleTagInputConfirm = e => {
    console.log(e.target.value);
    const newTag = e.target.value;
    const {topicTags, changeTopicTags} = this.props; 
    if(topicTags.indexOf(newTag) < 0){
      const tags = [...topicTags, newTag];
      changeTopicTags(tags);  
    }  
    this.setState({
      inputVisible: false,
    });  
  }

  handleModalCancel = e => {
    this.setState({
      modalVisible: false,
    });      
  }

  handleSelectBoard = e => {

    const {changeTopicBoard} = this.props;

    if(!e.target.dataset.boardId && !e.target.parentNode.dataset.boardId) return;

    const dataset = e.target.dataset.boardId === undefined ? e.target.parentNode.dataset : e.target.dataset;
    
    changeTopicBoard({
      topicBoardId: dataset.boardId,
      topicBoardName: dataset.boardName,
      topicBoardColor: dataset.boardColor,  
    });

    this.setState({
      modalVisible: false,
    });
  }

  showTagInput = e => {
    this.setState({
      inputVisible: true  
    }, () => {
      this.tagInputEl.focus();
    });          
  }

  toggleDrawer = () => {
    this.props.toggleDrawer();  
  }

  render(){
    const {
      logo, status='init', onMenuClick, currentUser, boardList, boardId, boardColor, boardName, topicTags
    } = this.props;

    const {modalVisible, inputVisible} = this.state;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="profile"><i className="iconfont icon-profile"/><span>Profile</span></Menu.Item>
        <Menu.Item key="setting" disabled><i className="iconfont icon-sinaweibo18"/><span>Setting</span></Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="logout" ><i className="iconfont icon-tuichu"/><span>Logout</span></Menu.Item> 
      </Menu>
    ); 

    const topicPostBox = (
      <div className={styles.postBoxWrapper}>
        <div className={styles.postBoxTitle}>
          Post topic
        </div>
        <div className={styles.selectBoard}>
          <div className={styles.label}>
            Choose board for topic will be convenient for classification retrieval
          </div>
          <div className={styles.selectBoardBtn}>
            <Button onClick={this.handleSelectBoardBtnClick} className={`${prefix}-btn`}> 
              <span className={styles.disc} style={{color: boardColor}}>
                <i className="iconfont icon-circle"/>
              </span>
              <span className={styles.boardName}>{boardName || 'Choose board'}</span>    
            </Button>
            <Modal
              title="Choose Board"
              visible={modalVisible}
              wrapClassName={styles.modalBoards}  
              maskStyle={{zIndex: 1031}}
              maskClosable={false}
              footer={null}
              onCancel={this.handleModalCancel}  
            >
              <div className={styles.boardWrapper} onClick={this.handleSelectBoard}>
                {boardList.map(board => (
                  <div 
                    className={styles.board} 
                    key={board.boardName} 
                    data-board-id={board.boardId}
                    data-board-name={board.boardName}
                    data-board-color={board.boardColor}
                  >
                    <i className={`iconfont icon-circle ${styles.modalBoardDisc}`} style={{color: board.boardColor}}/>  
                    <span className={styles.modalBoardName}>{board.boardName}</span>      
                  </div>
                ))}  
              </div> 
            </Modal>    
          </div>  
        </div>
        <div className={styles.addTags}>
          <div className={styles.label}>
            Add tags will also be good for classification retrieval and make your topic easier for readers to find
          </div>
          <div className={styles.tags}>
            {topicTags.map(tag => {
              const isLongTag = tag.length > 20;
              const tagElement = (
                <Tag key={tag} closable onClose={e=>{this.handleTagClose(tag)}} className={`${prefix}-tag`}>
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}      
                </Tag>
              );
              return isLongTag ? (
                <Tooltip
                  title={tag}
                  key={tag}
                  overlayClassName={styles.tagTooltip}  
                >
                  {tagElement}  
                </Tooltip>  
              ) : tagElement
            })}
            {inputVisible ? (
              <Input
                ref={tagInputEl => this.tagInputEl = tagInputEl}
                type="text"
                size="small"
                onBlur={this.handleTagInputConfirm}
                onPressEnter={this.handleTagInputConfirm}
                className={`${styles.tagInput} ${prefix}-input`}
              />       
            ) : (
              <Tag className={`${styles.addTagBtn} ${prefix}-tag`} onClick={this.showTagInput}>
                <i className="anticon anticon-plus"/>
                New Tag          
              </Tag>    
            )}  
          </div>
        </div>
        <div className={styles.submitBtnWrapper}>
          <Button 
            className={`${prefix}-btn ${styles.submitBtn}`} 
            type="primary" 
            ghost 
            disabled={boardId === undefined}
          >
            Submit
          </Button>      
        </div>
      </div>    
    );

    return (
      <div className={styles.header}>
        <Link to="/" className={styles.logo} key="logo">
          <img src={logo} alt="logo" width="28px"/>
          <Divider type="vertical"/>      
          <h1>Editor</h1>
        </Link> 
        <div className={styles.status}>
          {infoIcon[status]}
          <span className={styles.statusText}>{info[status]}</span>  
        </div>
        <div className={styles.right}>
          <Dropdown overlay={menu} overlayClassName={`${prefix}-dropdown`} placement="bottomRight" trigger={['hover', 'click']}>
            <span className={styles.account}>
              <Avatar className={styles.avatar} src={currentUser.avatar} size="small"/>    
            </span>
          </Dropdown>
          <Tooltip
            placement="bottom"
            title="history"
            overlayClassName={styles.tooltipOverlayer}  
          >
            <Button className={`${prefix}-btn ${styles.button} ${styles.historyBtn}`} size="small">{historyIcon}</Button>   
          </Tooltip>
          <Button className={`${prefix}-btn ${styles.button} ${styles.settingBtn}`} size="small" onClick={this.toggleDrawer} id="drawerBtn">
            <i className="iconfont icon-sinaweibo18"/>
          </Button>
          <Popover
            placement="bottomRight"
            content={topicPostBox}
            overlayClassName={styles.postModalOverlayer}
            trigger="click"
            arrowPointAtCenter
            align={{
              offset: [20, 16]  
            }}    
          >
            <Button className={`${prefix}-btn ${styles.button}`} type="primary" ghost>Post</Button>      
          </Popover>
        </div>
      </div>
    );
  }
}