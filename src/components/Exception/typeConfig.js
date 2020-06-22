import React from 'react';

const config = {
  403: {
    img: <i className="iconfont icon-planet"/>,
    title: '403',
    desc: "Sorry, you don't have access to this page",
  },
  404: {
    img: <i className="iconfont icon-patternufo"/>,
    title: '404',
    desc: "Sorry, the page you visited does not exist",
  },
  500: {
    img: <i className="iconfont icon-iconfonthuojian02"/>,
    title: '500',
    desc: "Sorry, the server is reporting an error",
  }
};

export default config;