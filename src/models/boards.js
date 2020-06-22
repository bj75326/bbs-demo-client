import {queryBoards} from '../services/api';

export default {
  namespace: 'boards',

  state: {
    boardList: [
      {
        boardId: 1,
        boardName: "FAQ's",
        boardPath: "FAQ's",
        boardColor: "#fec260",
        topicCounts: 0,
        replyCounts: 0,
        ownerName: "Croal",
        boardDesc: "",
      },{
        boardId: 2,
        boardName: "Off-Topic Chatter",
        boardPath: "Off-Topic",
        boardColor: "#86e4bf",
        topicCounts: 0,
        replyCounts: 0,
        ownerName: "Stephine",
        boardDesc: "",
      },{
        boardId: 3,
        boardName: "Feedback",
        boardPath: "Feedback",
        boardColor: "#9f84f9",
        topicCounts: 0,
        replyCounts: 0,
        ownerName: "qiqi",
        boardDesc: "",
      },{
        boardId: 4,
        boardName: "Member Spotlight",
        boardPath: "Spotlight",
        boardColor: "#f47677",
        topicCounts: 0,
        replyCounts: 0,
        ownerName: "souljsd",
        boardDesc: "",
      },{
        boardId: 5,
        boardName: "Introductions",
        boardPath: "Introductions",
        boardColor: "#7bdce3",
        topicCounts: 0,
        replyCounts: 0,
        ownerName: "souljjd",
        boardDesc: "", 
      },{
        boardId: 6,
        boardName: "Announcements",
        boardPath: "Announcements",
        boardColor: "#f177c4",
        topicCounts: 0,
        replyCounts: 0,
        ownerName: "ifujack",
        boardDesc: "",
      },{
        boardId: 7,
        boardName: "Showcase",
        boardPath: "Showcase",
        boardColor: "#b0ced9",
        topicCounts: 0,
        replyCounts: 0,
        ownerName: "hhoozwzw",
        boardDesc: "",
      },{
        boardId: 8,
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