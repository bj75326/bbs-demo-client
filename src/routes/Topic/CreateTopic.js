import React, {Component} from 'react';
import {connect} from 'dva';
import {Form, Modal, Button, Input} from 'antd';
import classNames from 'classnames';
import styles from './CreateTopic.less';
import {prefix} from '../../common/setup'; 
import RichEditor from '../../components/RichEditor';
import moment from 'moment';
//import TestEditor from '../../components/RichEditor/test';

const {TextArea} = Input;

//获取当前时间戳
const getCurrentDate = () => {
  return moment().format('MMMM YYYY');  
};

@connect(({topic, boards, user}) => ({
  boardName: topic.topicBoardName,
  boardColor: topic.topicBoardColor,
  topicTags: topic.topicTags,
  boardList: boards.boardList,
  userName: user.currentUser.name,
}))
@Form.create({
  mapPropsToFields(props){
    console.log('mapPropsToFields', props);
    return {

    };  
  },
  onFieldsChange(props, fields){
    console.log('onFieldsChange', fields);
    props.dispatch({
      type: 'saveFields',
      payload: fields,
    });
  },
})
export default class CreateTopic extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      visible: false,
    };
  }

  handleBtnClick = () => {

  }

  render(){
    const {visible} = this.state;
    const {form, boardName, boardColor, userName} = this.props;
    const {getFieldDecorator} = form; 
    
    return (
      <div className={classNames('container', styles.container)}>
        <div className={styles.feedback}></div>
        <div className={styles.content}>
          <div className={styles.titleWrapper}>
            {getFieldDecorator('title')(
              <TextArea className={styles.title} placeholder="Title" rows="1"/>  
            )}
          </div>
          <div className={styles.header}>
            <div className={styles.info}>
              <div className={styles.name}>{userName}</div>
              <div className={styles.date}>{getCurrentDate()}</div>    
            </div>
            <div className={styles.boardBtnWrapper}>
              <Button className={classNames(`${prefix}-btn`, styles.boardBtn)} onClick={this.handleBtnClick}>
                <span className={styles.disc} style={{color: boardColor || '#d7d7d7'}}>
                  <i className="iconfont icon-circle"/>  
                </span>
                <span className={styles.boardName}>{boardName || 'Choose board'}</span>
              </Button>
            </div>
            <Modal
              title="Choose board"
              visible={visible}
            >
            </Modal>
          </div>
          <div >
            <RichEditor
              className="topicEditor" 
              currentContent={
              {
                "entityMap": {
                    
                },
                "blocks": [{
                    "key": "9gm3s",
                    "text": "Cillum cupidatat cupidatat nulla consectetur aliquip voluptate commodo. Veniam Lorem consectetur ipsum Lorem adipisicing consequat eu amet. Consequat ad culpa dolore Lorem in ipsum tempor sint in. Anim elit exercitation amet veniam ullamco voluptate dolore Lorem ut irure. Dolor officia laboris tempor adipisicing tempor voluptate qui commodo ad. Fugiat consectetur excepteur commodo reprehenderit ex reprehenderit aute ad. Cupidatat velit labore voluptate et proident qui commodo.",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "data": {}
                }, {
                    "key": "e23a8",
                    "text": "Commodo minim adipisicing pariatur duis pariatur nostrud aliqua fugiat occaecat. Commodo enim cillum culpa nulla eiusmod consectetur. Occaecat eiusmod eiusmod ad est eu enim esse incididunt.",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "data": {}
                }]
              }
            }/>
               
          </div>
        </div>
      </div>
    );
  }
}