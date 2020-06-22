import createInlineStyleButton from '../utils/createInlineStyleButton';
import {boldIcon} from '../../editorIcon';

export default createInlineStyleButton({
  style: 'BOLD',
  title: 'Bold (⌘b)',
  children: boldIcon,
});