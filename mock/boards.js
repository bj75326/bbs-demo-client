export const getBoards = (req, res) => {
  res.json([
    {
      boardName: "FAQ's",
      boardPath: "FAQ's",
      boardColor: "#fec260",
      topicCounts: 1286,
      replyCounts: 13516,
      ownerName: "Croal",
      boardDesc: "",
    },{
      boardName: "Off-Topic Chatter",
      boardPath: "Off-Topic",
      boardColor: "#86e4bf",
      topicCounts: 33,
      replyCounts: 1627,
      ownerName: "Stephine",
      boardDesc: "",
    },{
      boardName: "Feedback",
      boardPath: "Feedback",
      boardColor: "#9f84f9",
      topicCounts: 1873,
      replyCounts: 19283,
      ownerName: "qiqi",
      boardDesc: "",
    },{
      boardName: "Member Spotlight",
      boardPath: "Spotlight",
      boardColor: "#f47677",
      topicCounts: 7743,
      replyCounts: 32328,
      ownerName: "souljsd",
      boardDesc: "",
    },{
      boardName: "Introductions",
      boardPath: "Introductions",
      boardColor: "#7bdce3",
      topicCounts: 182,
      replyCounts: 3278,
      ownerName: "souljjd",
      boardDesc: "", 
    },{
      boardName: "Announcements",
      boardPath: "Announcements",
      boardColor: "#f177c4",
      topicCounts: 2833,
      replyCounts: 28833,
      ownerName: "ifujack",
      boardDesc: "",
    },{
      boardName: "Showcase",
      boardPath: "Showcase",
      boardColor: "#b0ced9",
      topicCounts: 633,
      replyCounts: 1772,
      ownerName: "hhoozwzw",
      boardDesc: "",
    },{
      boardName: "Jobs",
      boardPath: "Jobs",
      boardColor: "#c8c7ab",
      topicCounts: 8471,
      replyCounts: 17261,
      ownerName: "cc",
      boardDesc: "",
    }
  ]);
};

export default {
  getBoards,
};