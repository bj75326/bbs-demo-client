import {queryEditingTopic, postTopic} from '../services/api';

export default {
  namespace: 'topic',

  state: {
    topicId: undefined,
    topicTitle: undefined,
    topicAuthor: undefined,
    topicContent: undefined,          
    topicBoardId: undefined,
    topicBoardName: undefined,
    topicBoardColor: undefined,
    topicTags: [],
    status: undefined, // 'init', 'succ', 'err', 'wip'
    toolbarMode: 'static',
    format: 'spacing',
  },

  effects: {  
    *fetchTopic(_, {call, put}){
      const response = yield call(queryEditingTopic);
      yield put({
        type: 'changeTopic',
        payload: response,
      });  
    },
    *syncTopic({payload}, {call, put}){
      yield put({
        type: 'updateTopic',
        payload: {
          ...payload,
          status: 'wip'
        }
      });
      
      const response = yield call(postTopic, payload);
      console.log('response', response);
      yield put({
        type: 'updateTopic',
        payload: response,
      });  
    }      
  },

  reducers: {
    changeBoard(state, {payload}){
      return {
        ...state,
        topicBoardId: payload.topicBoardId,
        topicBoardName: payload.topicBoardName,
        topicBoardColor: payload.topicBoardColor, 
      }; 
    },
    changeTags(state, {payload}){
      return {
        ...state,
        topicTags: payload,
      };
    },
    changeMode(state, {payload}){
      return {
        ...state,
        toolbarMode: payload,  
      };  
    },
    
    changeTopic(state, {payload}){
      return {
        ...state,
        topicId: payload.topicId,
        topicTitle: payload.topicTitle,
        topicAuthor: payload.topicAuthor,
        topicContent: payload.topicContent,
        topicBoardId: payload.topicBoardId,
        topicBoardName: payload.topicBoardName,
        topicBoardColor: payload.topicBoardColor,
        topicTags: payload.topicTags,
        status: payload.status,  
        toolbarMode: payload.toolbarMode,
        format: payload.format,
      }; 
    },
    updateTopic(state, {payload}){
      return {
        ...state,
        ...payload,
      }
    }
  },
};