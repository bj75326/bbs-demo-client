/**
 * '/userinfo/2144/id'
 * =>
 * ['/userinfo', '/userinfo/2144', '/userinfo/2144/id']        
 */
export function urlToList(url){
  // urlList: ['userInfo', '2144', 'id']
  const urlList = url.split('/').filter(i => i);
  return urlList.map((urlItem, index) => {
    return `/${urlList.slice(0, index + 1).join('/')}`;  
  });
}