import createblockStyleButton from '../utils/createBlockStyleButton';
import {headerIcon} from '../../editorIcon';

export default createblockStyleButton({
  blockType: 'header-two',
  title: 'Header (⌘⌥1)',
  children: headerIcon,
});