import {parse} from 'url';
//import {moment} from 'moment';
var moment = require('moment');

//mock topicList
const avatars = [
  'https://bj75326.github.io/ba-asset/avatar/bear.jpg',
  'https://bj75326.github.io/ba-asset/avatar/cat.jpg',
  'https://bj75326.github.io/ba-asset/avatar/dog.jpg',
  'https://bj75326.github.io/ba-asset/avatar/elephant.jpg',
  'https://bj75326.github.io/ba-asset/avatar/hedgehog.jpg',
  'https://bj75326.github.io/ba-asset/avatar/kangaroo.jpg',
  'https://bj75326.github.io/ba-asset/avatar/panda.jpg',
  'https://bj75326.github.io/ba-asset/avatar/raccoon.jpg',  
];

const names = [
  'harryowlson',
  'coralGao',
  'de',
  'Eugene123',
  'tiffany_young',
  'taeyeon',
  'bj75326',
  'Bill_Ji',
];

const topics = [
  {
    topicTitle: 'Introduce Yourself!',
    topicContent: 'Hey @everyone, new member alert here! Through I\'d write a bit about myself and why im here. First of my name is Harry and im 31 years old massive fan of ...',   
  },
  {
    topicTitle: 'The 12 month member programme',
    topicContent: 'This is looking great! Quick question, if I already have a membership, can I upgrade it to include these new perks?',
  },
  {
    topicTitle: 'What are you working on?',
    topicContent: 'Right now i\'m working with this fantastic client who are looking to re-design their forum, currently we\'ve just completed our research phase and moving into...',
  },
  {
    topicTitle: 'A job opportunity location Shanghai',
    topicContent: 'Details will send by email, ping me address...'
  },
  {
    topicTitle: 'UI of a new airline app, help needed!',
    topicContent: 'I wonder, have you tried moving the check-in and check-out fields below the date picker? That would probably help with the flow issues you\'re having. Hope this...', 
  },
  {
    topicTitle: 'Have you heard the song [Home]?',
    topicContent: 'People of high intellectual endowments do not require familiar ones in those they love. I can say Diana Wang really really a talent singer in C-POP...',
  },
  {
    topicTitle: 'Restful url api design',
    topicContent: 'I believe I have already thoroughly beaten this to death, but query strings are not for "filtering" resources. They are for identifying your resource from non-hierarchical data. If you ...',
  },
  {
    topicTitle: 'More boards needed for our Forum',
    topicContent: 'Well I\'ve seen the aurora lights, passed out in Shibuya at night, I keep moving on and on, Put it back together, watched it fall apart...'
  },
];

const operations = ['reply', 'update', 'create'];

const tags = ['Test', 'Demo', 'CC', 'UI'];

const boards = [
  {
    boardName: "FAQ's",
    boardPath: "FAQ's",
    boardColor: "#fec260",
  },{
    boardName: "Off-Topic Chatter",
    boardPath: "Off-Topic",
    boardColor: "#86e4bf",
  },{
    boardName: "Feedback",
    boardPath: "Feedback",
    boardColor: "#9f84f9",
  },{
    boardName: "Member Spotlight",
    boardPath: "Spotlight",
    boardColor: "#f47677",
  },{
    boardName: "Introductions",
    boardPath: "Introductions",
    boardColor: "#7bdce3",  
  },{
    boardName: "Announcements",
    boardPath: "Announcements",
    boardColor: "#f177c4",
  },{
    boardName: "Showcase",
    boardPath: "Showcase",
    boardColor: "#b0ced9",
  },{
    boardName: "Jobs",
    boardPath: "Jobs",
    boardColor: "#c8c7ab",
  }
];

const shuffle = (arr) => {
  //输入的数组不应该被改变
  const newArr = [...arr];
  return newArr.sort(() => Math.random() * 2 - 1);
};

let topicListDataSource = [];
for(let i = 0; i < 238; i++){
  const baseCount = Math.ceil(Math.random() * 8);

  topicListDataSource.push({
    topicId: 101793 - i,
    avatar: avatars[i % 8],
    authorName: names[i % 8],
    ...topics[Math.floor(Math.random() * 8)],
    lastUpdateBy: names[Math.floor(Math.random() * 8)],
    lastUpdateTime: moment().subtract(Math.ceil(Math.random() * 7200), 'seconds').fromNow(),
    lastOperation: operations[Math.floor(Math.random() * 3)],
    replyCount: Math.floor(Math.random() * 20),
    actorCount: baseCount,
    actorAvatars: (function(){
      let ret = [];
      ret = baseCount <= 3 ? shuffle(avatars).slice(0, baseCount) : shuffle(avatars).slice(0, 4);
      return ret;
    })(),
    tags: (function(){
      const counts = Math.floor(Math.random() * 5);
      const ret = shuffle(tags).slice(0, counts);
      return ret;
    })(),
    ...boards[Math.floor(Math.random() * 8)],
  });
}

export function getMockTopics(req, res, u) {
  let url = u;
  if(!url || Object.prototype.toString.call(url).slice(8, -1) !== 'String'){
    url = req.url;
  }
  const params = parse(url, true).query;
  
  let dataSource = [...topicListDataSource];

  const pageSize = params.pageSize || 20;
  if(params.currentPage){
    const page = params.currentPage;
    dataSource = dataSource.splice((page - 1)*pageSize, pageSize);
  }

  const result = {
    topicList: dataSource,
    pagination: {
      total: topicListDataSource.length,
      pageSize: parseInt(pageSize, 10) || 20,
      current: parseInt(params.currentPage, 10) || 1,  
    }  
  };

  if(res && res.json){
    res.json(result);
  }else{
    return result;
  }
}

export const getTopics = (req, res) => {
  res.json([
    {
      topicId: '101716',
      avatar: 'https://bj75326.github.io/ba-asset/avatar/bear.jpg',
      authorName: 'harryowlson',
      topicTitle: 'Introduce Yourself!',
      topicContent: 'Hey @everyone, new member alert here! Through I\'d write a bit about myself and why im here. First of my name is Harry and im 31 years old massive fan of ...',
      lastUpdateBy: 'harryowlson',
      lastUpdateTime: '5 minutes ago',
      lastOperation: 'reply', // 'reply', 'update', 'create'
      replyCount: 7,
      actorCount: 6,
      actorAvatars: ['https://bj75326.github.io/ba-asset/avatar/bear.jpg'
        ,'https://bj75326.github.io/ba-asset/avatar/cat.jpg'
        ,'https://bj75326.github.io/ba-asset/avatar/dog.jpg'
        ,'https://bj75326.github.io/ba-asset/avatar/elephant.jpg'
      ],
      tags: ['Test', 'Demo'],
      boardName: 'Introductions',
      boardColor: '#86e4bf',
    }, {
      topicId: '101718',
      avatar: 'https://bj75326.github.io/ba-asset/avatar/cat.jpg',
      authorName: 'de',
      topicTitle: 'The 12 month member programme',
      topicContent: 'This is looking great! Quick question, if I already have a membership, can I upgrade it to include these new perks?',
      lastUpdateBy: 'de',
      lastUpdateTime: '36 minutes ago',
      lastOperation: 'create',
      replyCount: 6,
      actorCount: 4,
      actorAvatars: ['https://bj75326.github.io/ba-asset/avatar/bear.jpg'
        ,'https://bj75326.github.io/ba-asset/avatar/cat.jpg'
        ,'https://bj75326.github.io/ba-asset/avatar/dog.jpg'
        ,'https://bj75326.github.io/ba-asset/avatar/elephant.jpg'
      ],
      tags: ['CC', 'Test'],
      boardName: 'Announcements',
      boardColor: '#f177c4',
    }  
  ]);
};
export default {
  getTopics,
  getMockTopics,
};