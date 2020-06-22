import mockjs from 'mockjs';
import {getNotices} from './mock/notices'; 
import {getMockTopics} from './mock/topics';
import {getBoards} from './mock/boards';
import {format, delay} from 'roadhog-api-doc';

//是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

const proxy = {
  //支持值为 Object 和 Array
  'GET /user/authority': {
    authority: 'admin'        // ['guest', 'user', 'admin']
  },
  'GET /api/currentUser': {
    $desc: "获取当前用户接口",
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Bill Ji',
      avatar: 'https://bj75326.github.io/ba-asset/avatar/avatar.jpg',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  'GET /api/users': {

  },
  'GET /api/notices': getNotices,
  'POST /api/register/name': {
    existed: true,
  },
  'POST /api/login/account': (req, res) => {
    const {password, userName} = req.body;
    if(password === '888888' && userName === 'admin'){
      res.send({
        status: 'ok'
      });
      return;
    }  
    if(password === '123456' && userName === 'user'){
      res.send({
        status: 'ok'
      });
      return;
    }
    res.send({
      status: 'error'
    });
  },
  'GET /api/logout/account': (req, res) => {
    res.send({
      status: false
    });
  },
  'GET /api/topics': getMockTopics,
  'GET /api/boards': getBoards,
  'GET /api/topic': {
    topicId: '00000001',
    topicTitle: 'Example topic title',
    topicAuthor: 'Bill Ji',
    topicContent: {
      "entityMap": {
          
      },
      "blocks": [{
          "key": "9gm3s",
          "text": "Cillum cupidatat cupidatat nulla consectetur aliquip voluptate commodo. Veniam Lorem consectetur ipsum Lorem adipisicing consequat eu amet. Consequat ad culpa dolore Lorem in ipsum tempor sint in. Anim elit exercitation amet veniam ullamco voluptate dolore Lorem ut irure. Dolor officia laboris tempor adipisicing tempor voluptate qui commodo ad. Fugiat consectetur excepteur commodo reprehenderit ex reprehenderit aute ad. Cupidatat velit labore voluptate et proident qui commodo.",
          "type": "unstyled",
          "depth": 0,
          "inlineStyleRanges": [],
          "entityRanges": [],
          "data": {}
      }, {
          "key": "e23a8",
          "text": "Commodo minim adipisicing pariatur duis pariatur nostrud aliqua fugiat occaecat. Commodo enim cillum culpa nulla eiusmod consectetur. Occaecat eiusmod eiusmod ad est eu enim esse incididunt.",
          "type": "unstyled",
          "depth": 0,
          "inlineStyleRanges": [],
          "entityRanges": [],
          "data": {}
      }]
    },          
    topicBoardId: undefined,
    topicBoardName: undefined,
    topicBoardColor: undefined,
    topicTags: ['tag01', 'tag02'],
    status: "init",
    toolbarMode: "static",
    format: "spacing",  
  },
  'POST /api/edit/topic': {
    status: "succ"  
  },
};

export default noProxy ? {} : delay(proxy, 2000);
