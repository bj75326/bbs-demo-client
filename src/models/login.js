import {routerRedux} from 'dva/router';
import {accountLogin, accountLogout} from '../services/api';
import {reloadAuthorized} from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },
  
  effects: {
    *login({payload}, {call, put}){
      const response = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      if(response.status === 'ok'){
        //ant-design-pro 用来更新下客户端缓存的authority，这里保留向后台再次核对下登录状态
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      }
    },
    *logout(_, {put, call, select}){
      try{
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        //logout的时候讲当前的页面路径保存在location的searchParams中
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      }finally{
        const response = yield call(accountLogout);
        yield put({
          type: 'changeLoginStatus',
          payload: response,  
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }  
    },
  },

  reducers: {
    changeLoginStatus(state, {payload}){
      return {
        ...state,
        status: payload.status,
        //type: payload.type,
      };    
    }
  },
};