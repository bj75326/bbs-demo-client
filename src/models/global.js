import {queryNotices} from '../services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: true,
    notices: [],
  },

  effects: {
    *fetchNotices(_, {call, put}){
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *clearNotices({payload}, {put, select}){
      yield put({
        type: 'saveClearedNotices',
        payload,  
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
  },

  reducers: {
    changeCollapsed(state, {payload}){
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, {payload}){
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, {payload}){
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
  },

  
};