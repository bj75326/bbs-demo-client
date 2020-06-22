import {createElement} from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';

import {getMenuData} from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => {
  return !app._models.some(({namespace}) => {
    //model传入的字符串
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });
};

//wrapper of dva/dynamic
const dynamicWrapper = (app, models, component) => {
  //.webpackrc.js中设置 "disableDynamicImport" 为true
  //transfrom by babel-plugin-dynamic-import-node-sync
  if(component.toString().indexOf('.then(') < 0){
    models.forEach(model => {
      if(modelNotExisted(app, model)){
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if(!routerDataCache){
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  //.webpackrc.js中设置 "disableDynamicImport" 为false
  //transform by babel-plugin-dynamic-import-node-async 
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)
    ).map(
      m => import(`../models/${m}.js`)
    ),
    component: () => {
      if(!routerDataCache){
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        //console.log('Component', Component);
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

/**
 * 将menus拍平转化成path 与 menuData的键值对
 * [{
 *    name: 'Dashboard',
 *    icon: 'Dashboard',
 *    path: '/dashboard',
 *    authority: 'user',
 *    children: [{
 *      name: 'Analysis',
 *      path: '/dashboard/analysis',
 *      authority: 'user',
 *    },{
 *      ...
 *    }]
 * },{
 *    ...
 * }]
 * 
 * => 
 * 
 * {
 *    '/dashboard': {
 *      name: 'Dashboard',
 *      icon: 'Dashboard',
 *      path: '/dashboard',
 *      authority: 'user',
 *      children: []  
 *    },
 *    '/dashboard/analysis': {
 *      name: 'Analysis',
 *      path: '/dashboard/analysis',
 *      authority: 'user'
 *    }
 * } 
 */
function getFlatMenuData(menus){
  let keys = {};
  menus.forEach(item => {
    if(item.children){
      keys[item.path] = {...item};
      keys = {
        ...keys,
        ...getFlatMenuData(item.children),
      };
    }else{
      keys[item.path] = {...item};
    }
  });
  return keys;
}

/**
 * 生成系统的最终的路由数据，根据 routerConfig 辅助抹平后的 menuData 生成routerData
 * {
 *    '/': {
 *      component: dynamicWrapper返回值，
 *      name: routerConfig和menuData中设置，
 *      authority: 同上，
 *    }
 * } 
 */
export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/t': {
      component: dynamicWrapper(app, [], () => import('../layouts/BasicLayoutTest')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),  
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/forum': {
      component: dynamicWrapper(app, ['home', 'boards'], () => import('../routes/Home/Home')),
    },
    '/forum/latest': {
      component: dynamicWrapper(app, ['home', 'boards'], () => import('../routes/Home/Latest')),
    },
    '/forum/hottest': {
      component: dynamicWrapper(app, ['home', 'boards'], () => import('../routes/Home/Hottest')),
    },
    '/forum/following': {
      component: dynamicWrapper(app, ['home', 'boards'], () => import('../routes/Home/Following')),
    },
    '/topic/create': {
      component: dynamicWrapper(app, ['user', 'topic', 'boards'], () => import('../layouts/EditorLayout')),
    },
    '/topic/:topic': {
      component: dynamicWrapper(app, ['topic'], () => import('../routes/Topic/Topic')),  
    },
    '/board/:board': {
      component: dynamicWrapper(app, ['board'], () => import('../routes/Board/Board')),
    },
    '/boards': {
      component: dynamicWrapper(app, ['boards'], () => import('../routes/Boards/Boards')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    }
  };

  const menuData = getFlatMenuData(getMenuData());

  const routerData = {};

  Object.keys(routerConfig).forEach(path => {
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(key));
    
    let menuItem = {};
    if(menuKey){
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
    };
    routerData[path] = router;
  });

  return routerData;
};