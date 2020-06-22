import {queryBoards} from '../services/api';

export default {
  namespace: 'board',

  state: {
    boardList: [
      {
        boardName: "FAQ's",
        boardPath: "FAQ's",
        boardColor: "#fec260",
        topicCounts: 0,
        replyCounts: 0,
        ownerName: "Croal",
        boardDesc: "",
      },{
        boardName: "Off-Topic Chatter",
        boardPath: "Off-Topic",
        boardColor: "#86e4bf",
        topicCounts: 0,
        replyCounts: 0,
        ownerName: "Stephine",
        boardDesc: "",
      },{
        boardName: "Feedback",
        boardPath: "Feedback",
        boardColor: "#9f84f9",
        topicCounts: 0,
        replyCounts: 0,
        ownerName: "qiqi",
        boardDesc: "",
      },{
        boardName: "Member Spotlight",
        boardPath: "Spotlight",
        boardColor: "#f47677",
        topicCounts: 0,
        replyCounts: 0,
        ownerName: "souljsd",
        boardDesc: "",
      },{
        boardName: "Introductions",
        boardPath: "Introductions",
        boardColor: "#7bdce3",
        topicCounts: 0,
        replyCounts: 0,
        ownerName: "souljjd",
        boardDesc: "", 
      },{
        boardName: "Announcements",
        boardPath: "Announcements",
        boardColor: "#f177c4",
        topicCounts: 0,
        replyCounts: 0,
        ownerName: "ifujack",
        boardDesc: "",
      },{
        boardName: "Showcase",
        boardPath: "Showcase",
        boardColor: "#b0ced9",
        topicCounts: 0,
        replyCounts: 0,
        ownerName: "hhoozwzw",
        boardDesc: "",
      },{
        boardName: "Jobs",
        boardPath: "Jobs",
        boardColor: "#c8c7ab",
        topicCounts: 0,
        replyCounts: 0,
        ownerName: "cc",
        boardDesc: "",
      }
    ],    
  },

  effects: {
    *fetchBoards(_, {put, call}){
      const response = yield call(queryBoards);
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
        boardList: payload,
      };    
    }
  },
};