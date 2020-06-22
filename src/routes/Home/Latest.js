import React, {PureComponent} from 'react';
import TopicCard from '../../components/TopicCard';
import {Pagination} from 'antd';
import TopicListItem from '../../components/TopicListItem';
import {connect} from 'dva'; 
import {routerRedux} from 'dva/router';
import styles from './Latest.less';
import classNames from 'classnames';
import {prefix} from '../../common/setup';
import PropTypes from 'prop-types';

const PAGESIZE = 20;
const LOADINGSIZE = 10;
const parseSearch = (search) => {
  const ret = {}, seg = search.replace(/^\?/, '').split('&');
  seg.forEach(item => {
    if(item){
      const kv = item.split('=');
      ret[kv[0]] = kv[1]; 
    }
  });    
  return ret;
};

@connect(({home, loading}) => ({
  topicList: home.topicList,
  topicLoading: loading.effects['home/fetchTopics'],
  listStyle: home.listStyle,
  pagination: home.pagination,
}))
export default class LatestTopics extends PureComponent {

  static contextTypes = {
    isMobile: PropTypes.bool,
  }

  componentDidMount(){
    console.log('Latest mount!!');
    const currentPage = parseSearch(this.props.location.search)['page'] || 1;
    console.log(currentPage);
    this.props.dispatch({
      type: 'home/fetchTopics',
      payload: {
        type: 'latest',
        pageSize: PAGESIZE,
        currentPage,
      },
    });
  }

  handleCardClick = id => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push(`/topic/${id}`)); 
  }

  handlePageChange = page => {
    const {dispatch, match} = this.props;
    dispatch(routerRedux.push(`${match.url}?page=${page}`));
    dispatch({
      type: 'home/fetchTopics',
      payload: {
        type: 'latest',
        pageSize: PAGESIZE,
        currentPage: page,
      },
    });    
  }

  render(){
    console.log('Latest render');
    const {listStyle} = this.props;
    const {topicLoading, topicList, pagination: {total, pageSize, current}} = this.props;

    const loading = topicLoading;
    const length = loading ? LOADINGSIZE : topicList.length;

    let body = [];
    for(let i = 0; i < length; i++){
      let itemProps = {loading};
      if(!loading){
        itemProps = {...topicList[i], loading,};
      }
      if(listStyle === 'card'){
        itemProps = {...itemProps, onCardClick: this.handleCardClick,}
        body.push(<TopicCard {...itemProps} key={`card_${i}`}/>);
      }else if(listStyle === 'list'){
        body.push(<TopicListItem {...itemProps} key={`list_${i}`} />);
      }
    }

    //body.push(<TopicCard loading key="test" />);

    return (
      <div className={styles.container}>
        {body}
        {loading || 
          <Pagination 
            className={classNames(styles.pagination, `${prefix}-pagination`)}
            current={current} 
            pageSize={pageSize} 
            total={total} 
            onChange={this.handlePageChange}
            simple={this.context.isMobile}
          />
        }
      </div>  
    );
  }
}