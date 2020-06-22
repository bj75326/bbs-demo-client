import React from 'react';
import {Layout, Spin} from 'antd';
import {connect} from 'dva'; 
import EditorHeader from '../components/EditorHeader';
import DocumentTitle from 'react-document-title';
import NewCreateTopic from '../routes/Topic/NewCreateTopic';
import {contains} from '../utils/utils';

import styles from './EditorLayout.less';
import logo from '../assets/logo.svg';

const {Content, Header, Footer} = Layout;

class EditorLayout extends React.PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {
      drawerVisible: false,  
    };
  }

  componentDidMount(){
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
    this.props.dispatch({
      type: 'topic/fetchTopic',
    });      
  }

  getPageTitle(){
    const {routerData, location} = this.props;
    const {pathname} = location;
    let title = 'bbs-demo';
    if(routerData[pathname] && routerData[pathname].name){
      title = `${routerData[pathname].name} - ${title}`;  
    }  
    return title;
  }

  setTopicBoard = payload => {
    this.props.dispatch({
      type: 'topic/changeBoard',
      payload  
    });  
  }

  setTopicTags = payload => {
    this.props.dispatch({
      type: 'topic/changeTags',
      payload
    });
  }

  toggleDrawer = () => {
    this.setState({
      drawerVisible: !this.state.drawerVisible,
    });  
  } 

  onDrawerClose = () => {
    this.setState({
      drawerVisible: false,
    });
  }

  closeDrawer = e => {
    const root = document.querySelector(`.${styles.drawerWrapper}`);
    const drawerBtn = document.querySelector('#drawerBtn');
    if(e.target === drawerBtn || e.target.parentNode === drawerBtn){
      return;
    }

    if(root && !contains(root, e.target)){
      this.setState({
        drawerVisible: false,
      });    
    }
  }

  render(){
    const {currentUser, boardList, boardId, boardColor, boardName, topicTags, status} = this.props;
    
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <Layout className={styles.editorLayout} onMouseUp={this.closeDrawer}>
          <Header 
            style={{
              position: 'fixed',
              width: '100%',    
            }}
          >
            <EditorHeader
              logo={logo}
              currentUser={currentUser}
              status={undefined}
              boardList={boardList}
              boardId={boardId}
              boardColor={boardColor}
              boardName={boardName}
              topicTags={topicTags}
              status={status}
              changeTopicBoard={this.setTopicBoard}
              changeTopicTags={this.setTopicTags}
              toggleDrawer={this.toggleDrawer}
            />      
          </Header>
          <Content>
            <NewCreateTopic 
              drawerVisible={this.state.drawerVisible} 
              onDrawerClose={this.onDrawerClose}
              drawerClassName={styles.drawerWrapper}
            />    
          </Content>       
        </Layout>        
      </DocumentTitle>
    );
  }
} 

export default connect(({user, boards, global, topic}) => ({
  currentUser: user.currentUser,
  boardList: boards.boardList,
  boardId: topic.topicBoardId,
  boardColor: topic.topicBoardColor,
  boardName: topic.topicBoardName,
  topicTags: topic.topicTags,
  status: topic.status,
}))(EditorLayout);