import createBlockStyleButton from '../utils/createBlockStyleButton';
import {blockquoteIcon} from '../../editorIcon';

export default createBlockStyleButton({
  blockType: 'blockquote',
  title: 'Blockquote (⌘⇧9)',
  children: blockquoteIcon,
});