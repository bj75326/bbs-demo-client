export const getNotices = (req, res) => {
  res.json([
    {
      id: '000000001',
      avatar: 'https://bj75326.github.io/ba-asset/avatar/bear.jpg',
      title: 'Forum now is available for public test',
      datetime: '2018-09-20',
      type: 'General',
    },
    {
      id: '000000002',
      avatar: 'https://bj75326.github.io/ba-asset/avatar/cat.jpg',
      title: 'Move to California and never grow up',
      datetime: '2018-09-19',
      type: 'General'
    },
    {
      id: '000000003',
      avatar: 'https://bj75326.github.io/ba-asset/avatar/dog.jpg',
      title: 'Til we hit the ocean, just put the keys in',
      datetime: '2018-09-20',
      type: 'General',
    },
    {
      id: '000000004',
      avatar: 'https://bj75326.github.io/ba-asset/avatar/elephant.jpg',
      title: 'Chestnuts roastin like a hot July',
      datetime: '2018-09-19',
      type: 'General'
    }
  ]);
};
export default {
  getNotices,
};