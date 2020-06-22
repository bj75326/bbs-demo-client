import {EditorState} from 'draft-js';
import {insertAtomicBlockWithoutUnstyledBlock} from '../../util';

const insertInlineTeX = editorState => {

};

const insertTeXBlock = (editorState, inputTeX, extraData = {}) => {
  const type = 'MATHJAX';
  const data = {
    ...extraData,
    inputTeX,  
  }; 
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(type, 'IMMUTABLE', data);
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  const newEditorState = insertAtomicBlockWithoutUnstyledBlock(
    editorState,
    entityKey,
    ' '
  );
  console.log('selectionBefore: ', newEditorState.getCurrentContent().getSelectionBefore().getStartKey());
  console.log('selectionBefore: ', newEditorState.getCurrentContent().getSelectionBefore().getStartOffset());
  console.log('selectionBefore: ', newEditorState.getCurrentContent().getSelectionBefore().getHasFocus());

  return EditorState.forceSelection(
    newEditorState,
    newEditorState.getCurrentContent().getSelectionAfter(),
  );
};

/*
const insertTeXBlock1 = (editorState, inputTeX, extraData = {}) => {
  const type = 'MATHJAX';
  const data = {
    ...extraData,
    inputTeX,
    type,
  };

  const newEditorState = insertAtomicBlockWithoutUnstyledBlock(
    editorState,
    null,
    null,
    data,
  );

  return EditorState.forceSelection(
    newEditorState,
    newEditorState.getCurrentContent().getSelectionAfter(),  
  );
};*/

export {
  insertInlineTeX,
  insertTeXBlock,
};

