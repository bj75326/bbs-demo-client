import createBlockStyleButton from '../utils/createBlockStyleButton';
import {unorderedListIcon} from '../../editorIcon';

export default createBlockStyleButton({
  blockType: 'unordered-list-item',
  title: 'Unordered List (⌘⇧8)',
  children: unorderedListIcon,
});