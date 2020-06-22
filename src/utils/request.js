import fetch from 'dva/fetch';
import {notification} from 'antd';
import {routerRedux} from 'dva/router';
import store from '../index';

const codeMessage = {
  200: 'The request has succeeded.',
  201: 'The request has succeeded and a new resource has been created as a result of it.',
  202: 'The request has entered the background queue.',
  204: 'The request has succeeded and corresponding resource has been deleted',
  400: 'The server could not understand the request due to invalid syntax.',
  401: 'The client must authenticate itself to get the requested response.',
  403: 'The client does not have access rights to the content.',
  404: 'The server can not find requested resource.',
  406: 'The server does not find any content following the criteria given by the user agent.',
  410: 'The requested content has been permenantly deleted from server, with no forwarding address.',
  422: 'The request was well-formed but was unable to be followed due to semantic errors.',
  500: 'Internal Server Error.',
  502: 'Bad Gateway.',
  503: 'Service Unavailable，the server is not ready to handle the request.',
  504: 'The server is acting as a gateway and cannot get a response in time.',
};

function checkStatus(response){
  if(response.status >= 200 && response.status < 300){
    return response;
  }
  //方便后续的Promise.catch捕获错误
  const errorText = codeMessage[response.status] || response.statusText; 
  notification.error({
    message: `request error ${response.status}: ${response.url}`,
    description: errorText,
  }); 
  const error = new Error(errorText);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * 向后台发出请求，返回一个promise
 * 
 * @param  {string} url         请求地址 
 * @param  {object} options   给fetch的额外的参数
 * @return {object}   
 */
export default function request(url, options){
  const defaultOptions = {
    credentials: 'include',
  };

  let expectErrorResponse;
  if(options){
    expectErrorResponse = options.expectErrorResponse;
  }

  const newOptions = {...defaultOptions, ...options};
  delete newOptions.expectErrorResponse;

  if(newOptions.method === 'POST' || newOptions.method === 'PUT'){
    if(!(newOptions.body instanceof FormData)){
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    }else{
      //newOptions.body是FormData的实例
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        ...newOptions.headers,
      };
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      if(newOptions.method === 'DELETE' || response.status === 204){
        return response.text();    
      }
      return response.json();
    }).catch(e => {
      //dva暴露的store中拿到dispatch
      const {dispatch} = store;
      const status = e.name;
      console.log('e!!!', e);
      if(status === 401){
        dispatch({
          type: 'login/logout',
        });
        return;    
      }
      if(status === 403){
        dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if(status <= 504 && status >= 500){
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      if(status >= 404 && status < 422){
        dispatch(routerRedux.push('/exception/404'));
        return;
      }
      return expectErrorResponse;
    });
}