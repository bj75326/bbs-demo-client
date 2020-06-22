import request from '../utils/request';

export async function queryAuthority(){
  return request('/user/authority', {
    credentials: 'include',             //携带cookie
  });
};

export async function query(){
  return request('/api/users');
};

export async function queryCurrent(){
  return request('/api/currentUser');
};