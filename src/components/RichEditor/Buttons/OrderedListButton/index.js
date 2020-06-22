import createBlockStyleButton from '../utils/createBlockStyleButton';
import {orderedListIcon} from '../../editorIcon';

export default createBlockStyleButton({
  blockType: 'ordered-list-item',
  title: 'Ordered List (⌘⇧7)',
  children: orderedListIcon,
});