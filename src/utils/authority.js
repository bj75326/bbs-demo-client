//因为暂时是单页应用(SPA)，前端部分需要保留authorized模块，多页则应该把权限判定交给后台去做。
import {queryAuthority} from '../services/user';

//暂时从localstorage中获取权限信息
/*
export const getAuthority = () => {
  return localStorage.getItem('bbs-demo-authority') || 'guest';
};

export const setAuthority = authority => {
  return localStorage.setItem('bbs-demo-authority', authority);
};
*/
//在bbs-demo项目中，考虑用cookie发送node后台获取session返回登录状态信息(暂定)

export async function getAuthority(){
  return queryAuthority();
};