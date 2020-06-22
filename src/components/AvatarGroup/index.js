import React, {PureComponent} from 'react';
import {Avatar} from 'antd';
import PropTypes from 'prop-types';
import styles from './index.less';
import classNames from 'classnames';

class AvatarGroup extends PureComponent {

  static propTypes = {
    maxAvatarNum: PropTypes.number,
    avatars: PropTypes.array,
    size: PropTypes.number,
    lapSize: PropTypes.number,
    actorCount: PropTypes.number,
  }

  static defaultProps = {
    maxAvatarNum: 4,
    avatars: [],
    size: 30,
    lapSize: 6,
    actorCount: 1,
  }

  render(){
    const {maxAvatarNum, className, avatars, size, lapSize, actorCount} = this.props;

    const liStyle = {
      width: size - lapSize,
      height: size,
    };

    const moreSpanStyle = {
      width: size-4,
      height: size-4,
      lineHeight: `${size-8}px`,
    };

    const moreIconStyle = {
      fontSize: `${size-8}px`
    };

    return (
      <ul className={classNames(styles.container, className)}>
        {avatars.slice(0, maxAvatarNum).map((item, index) => (
          <li style={liStyle} key={index}><Avatar src={item} size={size}/></li>
        ))}
        {actorCount > maxAvatarNum && 
          <li style={liStyle} className={styles.more}>
            <span style={moreSpanStyle}><i className="iconfont icon-more3" style={moreIconStyle}/></span>
          </li>
        }
      </ul>  
    );    
  }
}

export default AvatarGroup;