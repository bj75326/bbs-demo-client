import React from 'react';
import {Carousel, Button, Divider} from 'antd';
import {Link} from 'dva/router';
import styles from './index.less';
import {prefix} from '../../common/setup';

const HomeSider = props => {
  const {carouselList, boardList, wrapperCls, onNewTopicBtnClick} = props;

  return (
    <div className={wrapperCls}>
      <Carousel autoplay className={styles.carousel}>
        {carouselList.map(item => (
          <div key={item}><h3>{item}</h3></div>
        ))}
      </Carousel>
      <div className={styles.newTopicBtn}>
        <Button type="primary" className={`${prefix}-btn`} onClick={onNewTopicBtnClick}>
          Start New Discussion
        </Button>
      </div>
      <Divider className={styles.divider}/>
      <div className={styles.boardList}>
        <ul>
          {boardList.map((item) => (
            <li key={item.boardPath}>
              <Link to={`/board/${item.boardPath}`}>
                <span className={styles.disc} style={{color: item.boardColor}}><i className="iconfont icon-circle"/></span>
                <span className={styles.boardName}>{item.boardName}</span>
              </Link>
            </li>
          ))}
        </ul>    
      </div>
      <div className={styles.allBoard}>
        <Link to="/boards">
          <span><i className="iconfont icon-circle"/><i className="iconfont icon-circle"/></span>
          <span>View all boards...</span>    
        </Link>      
      </div>
      <Divider className={styles.divider}/>
    </div>
  );
};

export default HomeSider;