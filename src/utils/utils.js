
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path){
  return reg.test(path);
};

function getRelation(str1, str2){
  if(str1 === str2){
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if(arr2.every((item, index) => item === arr1[index])){
    //arr1包含arr2
    return 1;
  }else if(arr1.every((item, index) => item === arr2[index])){
    //arr2包含arr1
    return 2;
  }
  //arr2与arr1互不包含
  return 3;
}

function getRenderArr(routes){
  let renderArr = [];
  renderArr.push(routes[0]);
  for(let i = 1; i < routes.length; i++){
    let isAdd = false;
    //是否与renderArr中的path互不包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    //getRelation 会将两个完全相等的path返回 1
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if(isAdd){
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * 
 * @param {string} path  '/user'
 * @param {routerData} routerData {'/user': ..., '/user/login':..., '/user/register': ...} 
 */  
export function getRoutes(path, routerData){
  let routes = Object.keys(routerData).filter(routePath =>
    //筛选子路由 
    routePath.indexOf(path) === 0 && routePath !== path
  );
  //将子路由中path替换成''
  routes = routes.map(item => item.replace(path, ''));
  //获取所有子路由      
  const renderArr = getRenderArr(routes);
  const renderRoutes = renderArr.map(item => {
    //如果routes中没有item的子级路由，exact设为true
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
      exact,    
    };
  });
  return renderRoutes;
};

/**
 * @param {string} url 
 */

export function parseURL(url){
  const a = document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function(){
      const result = {}, seg = a.search.replace(/^\?/, '').split('&');
      seg.forEach(item => {
        if(item){
          const kv = item.split('=');
          result[kv[0]] = kv[1];    
        }
      });
      return result;
    })(),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^\/])/, '/$1'),
    segments: a.pathname.replace(/^\//, '').split('/'),
  };
};

/**
 * 
 */
export function insertAtCaret(inputElement, value) {
  //todo 浏览器兼容
  if(inputElement.setSelectionRange){
    const rangeStart = inputElement.selectionStart;
    const rangeEnd = inputElement.selectionEnd;
    
    const tempStr1 = inputElement.value.substring(0, rangeStart); 
    const tempStr2 = inputElement.value.substring(rangeEnd);
    return {
      newValue: `${tempStr1}${value}${tempStr2}`,
      newSelectionRange: rangeStart + value.length,
    }; 
  }
  throw new Error('setSelectionRange not supported.');
}

export function contains(root, n){
  let node = n;
  while(node) {
    if(node === root){
      return true;  
    }
    node = node.parentNode;    
  }
  return false;
}