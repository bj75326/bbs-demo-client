import {stringify} from 'qs';
import request from '../utils/request';

export async function queryNotices(){
  return request('/api/notices');  
};

export async function accountLogin(params){
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });  
};

export async function accountLogout(){
  return request('/api/logout/account');
};

export async function queryRegisteredName(params){
  return request('/api/register/name', {
    method: 'POST',
    body: params,
  });
};

export async function accountRegister(params){
  return request('/api/register/account', {
    method: 'POST',
    body: params,
  });
}

export async function queryTopics(params){
  return request(`/api/topics?${stringify(params)}`);
}

export async function queryBoards(){
  return request(`/api/boards`);
}

export async function queryEditingTopic(){
  return request(`/api/topic`);
}

export async function postTopic(params){
  return request(`/api/edit/topic`, {
    method: 'POST',
    body: params,
    expectErrorResponse: {
      status: 'err',
    },
  });    
}