import React, {Component, Fragment} from 'react';
import {Row, Col, Avatar} from 'antd';
import {routerRedux, Link} from 'dva/router';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './index.less';
import AvatarGroup from '../AvatarGroup';

export default class TopicCard extends Component {

  static propTypes = {
    loading: PropTypes.bool,
    className: PropTypes.string, 
    actorAvatars: PropTypes.array, 
  }

  static defaultProps = {
    loading: true,
    actorAvatars: [],
  }

  handleCardClick = () => {
    const {onCardClick, topicId} = this.props;
    if(onCardClick){
      onCardClick(topicId);
    }    
  }

  handleTagClick = (e) => {
    e.stopPropagation();
    const {onTagClick} = this.props;
    if(onTagClick){
      onTagClick(e);
    }  
  }

  render(){
    console.log('topicCard render');
    const {
      loading,
      className,
      boardName,
      boardColor,
      avatar,
      topicTitle,
      topicContent,
      lastOperation,
      lastUpdateBy,
      lastUpdateTime,
      actorAvatars,
      actorCount,
      replyCount,
      tags,
    } = this.props;
    console.log(loading);
    const classString = classNames(className, styles.card, {
      [styles.loading]: loading,  
    });

    const loadingContent = (
      <div className={styles.loadingContent}>
        <div className={styles.skeletonHeader}>
          <span className={styles.skeletonAvatar}></span>
        </div>
        <div className={styles.skeletonDesc}>
          <h2 className={styles.skeletonTitle}></h2>
          <h4 className={styles.skeletonUpdate}></h4>
          <ul className={styles.skeletonSection}>
            <li></li>
            <li></li>
          </ul>
        </div>      
      </div>
    );

    const loadingTags = (
      <div className={styles.loadingTags}>
        <span></span>
        <span></span>
      </div>
    );

    const lastUpdateDom = (
      <div className={styles.update}>
        <span>{lastOperation === 'reply' ? <i className="iconfont icon-reply"/> : <i className="iconfont icon-modify"/>}</span>
        {lastOperation === 'create' ? 
          <span>Created by @<span className={styles.name}>{lastUpdateBy}</span> {lastUpdateTime}</span> 
          : lastOperation === 'reply' ? <span>Latest reply from @<span className={styles.name}>{lastUpdateBy}</span> {lastUpdateTime}</span> 
          : <span>Latest updated by @<span className={styles.name}>{lastUpdateBy}</span> {lastUpdateTime}</span>
        }
      </div>
    );  

    return (
      <div className={classString} onClick={this.handleCardClick}>
        <div className={styles.tags}>
          {loading ? loadingTags : tags.map((item, index) => (
            <Link to={`/tag/${item}`} key={`${item}_${index}`} onClick={this.handleTagClick}>{item}</Link>
          ))}
          {loading || 
            <div className={styles.boardTag}>
              <span className={styles.disc} style={{color: boardColor}}><i className="iconfont icon-circle"/></span>
              <span>{boardName}</span>
            </div>
          }
        </div>
        <div className={styles.content}>
          {loading ? loadingContent : (
            <Fragment>
              <div className={styles.meta}>
                <div className={styles.header}>
                  <Avatar src={avatar} size={55}/>  
                </div>
                <div className={styles.desc}>
                  <h2>{topicTitle}</h2>
                  {lastUpdateDom}
                  <div className={styles.section}>{topicContent}</div>
                </div>
              </div>
              <div className={styles.actions}>
                <AvatarGroup
                  className={styles.avatarGroup} 
                  avatars={actorAvatars} 
                  size={32} 
                  actorCount={actorCount}
                />
                <div className={styles.counts}>
                  <span><i className="iconfont icon-comment-o"/></span>
                  <span>{replyCount} Comments</span>
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}
