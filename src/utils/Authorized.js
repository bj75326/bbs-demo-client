import RenderAuthorized from '../components/Authorized';
import {getAuthority} from './authority';

let Authorized = RenderAuthorized(getAuthority());

const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getAuthority());
};

export {reloadAuthorized};
export default Authorized;
