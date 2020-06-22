import createBlockStyleButton from '../utils/createBlockStyleButton';
import {codeBlockIcon} from '../../editorIcon';

export default createBlockStyleButton({
  blockType: 'code-block',
  title: 'Code Block (⌘⌥c)',
  children: codeBlockIcon,
});