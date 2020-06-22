import Authorized from './Authorized';
import AuthorizedRoute from './AuthorizedRoute';
import check, {checkMenuItems} from './CheckPermissions';

//权限存放
let current = {authority: null};

Authorized.AuthorizedRoute = AuthorizedRoute;
Authorized.check = check;
Authorized.checkMenuItems = checkMenuItems;

const renderAuthorize = currentAuthority => {
  if(currentAuthority){
    //currentAuthority为Function时
    if(Object.prototype.toString.call(currentAuthority).slice(8, -1) === 'Function'){
      current.authority = currentAuthority();
    }
    //currentAuthority为String时
    if(Object.prototype.toString.call(currentAuthority).slice(8, -1) === 'String'){
      current.authority = currentAuthority;
    }
    //currentAuthority为Promise时
    if(typeof currentAuthority === 'object' && typeof currentAuthority.then === 'function'){
      currentAuthority.then(({authority}) => {
        current.authority = authority;
      }).catch(error => {
        current.authority = 'error';
        throw new Error('queryAuthority occured error', error);
      });
      current.authority = currentAuthority;
    }
  }else{
    current.authority = null;
  }

  return Authorized;
};

export {current};
export default renderAuthorize;