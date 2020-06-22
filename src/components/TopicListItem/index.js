import React, {Component, Fragment} from 'react';
import {Link} from 'dva/router';
import {Avatar} from 'antd';
import PropTypes from 'prop-types';
import styles from './index.less';

export default class TopicListItem extends Component {
  
  static defaultProps = {
    loading: true,
  }

  static propTypes = {
    loading: PropTypes.bool,
  }

  render(){
    const {
      topicId,
      avatar,
      topicTitle,
      lastUpdateBy,
      lastUpdateTime,
      lastOperation,
      replyCount, 
      loading,   
    } = this.props;

    const loadingContent = (
      <div className={styles.loadingContent}>
        <div className={styles.skeletonHeader}>
          <span className={styles.skeletonAvatar}></span>
        </div>
        <ul className={styles.skeletonSection}>
          <li></li>
          <li></li>
        </ul>
      </div>
    );
    
    return (
      <div className={styles.listItem}>
        {loading ? loadingContent : (
          <Fragment>
            <div className={styles.avatar}>
              <Avatar src={avatar} size={50}/>  
            </div>
            <div className={styles.content}>
              <div className={styles.top}>
                <Link to={`/topic/${topicId}`}>{topicTitle}</Link>
                <div className={styles.author}>{lastUpdateBy}</div>  
              </div>
              <div className={styles.bottom}>
                <div className={styles.counts}>
                  <span><i className="iconfont icon-comment-o"/></span>
                  <span>{replyCount} Comments</span>
                </div>
                <div className={styles.time}>{`${lastOperation} at ${lastUpdateTime}`}</div>
              </div>
            </div>
          </Fragment>  
        )}
      </div>  
    );
  }
}