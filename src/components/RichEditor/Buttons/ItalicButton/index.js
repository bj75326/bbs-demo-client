import createInlineStyleButton from '../utils/createInlineStyleButton';
import {italicIcon} from '../../editorIcon';

export default createInlineStyleButton({
  style: 'ITALIC',
  title: 'Italic (⌘I)',
  children: italicIcon,
});