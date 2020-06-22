import {isUrl} from '../utils/utils';

//menu.js在ant-design-pro作为side menu的配置，暂且保留作路由拓展，呵呵
/**
 * 示例
 * [
  * {
  *    name: 'Dashboard',
  *    icon: 'Dashboard',
  *    path: 'dashboard',
  *    authority: 'user',
  *    hideInMenu: false,
  *    children: [{
  *      ...
  *    }]    
  * }
 * ]
 */
const menuData = [{
  name: 'Forum',
  icon: '',
  path: 'forum',
}, {
  name: 'Tutorials',
  icon: '',
  path: 'tutorials',
  children: [{
    name: 'v1.0.1',
    icon: '',
    path: 'v1.0.1',
  }, {
    name: 'v2.1.3',
    icon: '',
    path: 'v2.1.3',
  }],
}, {
  name: 'Examples',
  icon: '',
  path: 'examples',
}, {
  name: 'Support',
  icon: '',
  path: 'support',
}];

function formatter(data, parentPath = '/', parentAuthority){
  return data.map(item => {
    let {path} = item;
    if(!isUrl(path)){
      path = parentPath + path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if(item.children){
      result.children = formatter(item.children, `${parentPath}${item.path}/`, result.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);