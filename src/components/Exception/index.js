import React, {createElement} from 'react';
import classNames from 'classnames';
import {Button} from 'antd';
import config from './typeConfig';
import styles from './index.less';
import {prefix} from '../../common/setup';

export default ({className, linkElement = 'a', type, title, desc, img, actions, ...rest}) => {
  const pageType = type in config ? type : '404';
  const clsString = classNames(styles.exception, className);
  return (
    <div className={clsString} {...rest}>
      <div className={styles.imgEle}>
        {config[pageType].img}
      </div>
      <div className={styles.content}>
        <h1>{title || config[pageType].title}</h1>
        <div className={styles.desc}>{desc || config[pageType].desc}</div>
        <div className={styles.actions}>
          {
            actions || createElement(linkElement, {
              to: '/',
              href: '/',    
            }, <Button type="primary" className={`${prefix}-btn`}>Back to home</Button>)
          }
        </div>
      </div>
    </div>
  );
};