import {EditorState} from 'draft-js';
import {insertAtomicBlockWithoutUnstyledBlock} from '../../util';

export default entityType => (editorState, data) => {
  const contentState= editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    entityType,
    'IMMUTABLE',
    data
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = insertAtomicBlockWithoutUnstyledBlock(
    editorState,
    entityKey,
    ' '
  ); 
  console.log('after divider insert [hasFocus] ', newEditorState.getCurrentContent().getSelectionBefore().getHasFocus());
  return EditorState.forceSelection(
    newEditorState,
    newEditorState.getCurrentContent().getSelectionAfter() 
  );
}