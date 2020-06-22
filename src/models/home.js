import {queryTopics} from '../services/api';

export default {
  namespace: 'home',
  
  state: {
    carouselList: ['1', '2', '3', '4'],
    topicList: [],
    listStyle: 'card', //'card' or list 
    pagination: {
      total: 0,
      pageSize: 20,
      current: 1,
    }, //total: xx, pageSize: xx, current: xx
  },

  effects: {
    *fetchTopics({payload}, {put, call}){
      const response = yield call(queryTopics, payload); 
      yield put({
        type: 'save',
        payload: response,
      }); 
    }
  },

  reducers: {
    save(state, {payload}){
      return {
        ...state,
        topicList: payload.topicList,
        pagination: payload.pagination,
      };
    },
    toggleListStyle(state, {payload}){
      return {
        ...state,
        listStyle: payload,
      };
    }
  },
};