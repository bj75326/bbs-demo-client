import {queryRegisteredName, accountRegister} from '../services/api';
import {reloadAuthorized} from  '../utils/Authorized';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *checkNameUnique({payload}, {call}){
      const {value, callback} = payload;
      const response = yield call(queryRegisteredName, value);
      if(response.existed){
        callback('This name has been already used.');  
      }else{
        callback();
      }
    },
    *submit({payload}, {call, put}){
      const response = yield call(accountRegister, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
  },

  reducers: {
    registerHandle(state, {payload}){
      return {
        ...state,
        status: payload.status,
      };
    }
  },
};