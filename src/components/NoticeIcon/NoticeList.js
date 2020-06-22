import React from 'react';
import {List, Avatar} from 'antd';
import classNames from 'classnames';

import styles from './NoticeList.less';

/**
 * data 格式
 * [
 *    {
 *      id: '000000001',
 *      type: 'General', 'General' || 'Comment' || 'Follow' 
 *      avatar: '',
 *      title: '',
 *      description: '',
 *      datetime: '',  
 *      status: '',
 *      extra: '',
 *    },
 *    ...
 * ]
 */
export default function NoticeList({
  data=[], onClick, title, emptyText, emptyImage,
}){
  if(data.length === 0){
    return (
      <div className={styles.notFound}>
        {emptyImage ? (
          //<img src={emptyImage} alt="not found"/>
          emptyImage
        ) : null}
        <div className={styles.emptyText}>{emptyText}</div>
      </div>
    );
  }
  return (
    <div>
      <List className={styles.list}>
        {data.map((item, i) => {
          const itemCls = classNames({
            [styles.item]: true,
            [styles.read]: !!item.read,
          });  
          return (
            <List.Item className={itemCls} key={item.key || i} onClick={() => onClick(item)}> 
              <List.Item.Meta
                className={styles.meta}
                avatar={item.avatar ? <Avatar className={styles.avatar} src={item.avatar} /> : null}
                title={
                  <div className={styles.title}>
                    {item.title}
                    <div className={styles.extra}>{item.extra}</div>
                  </div>
                }
                description={
                  <div>
                    <div className={styles.description} title={item.description}>
                      {item.description}
                    </div>
                    <div className={styles.datetime}>{item.datetime}</div>
                  </div>
                }
              />
            </List.Item>
          );
        })}
      </List>
    </div>
  );
}