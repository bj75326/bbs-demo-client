import { EditorState} from 'draft-js';
import {getEntityKeyWithEntityData, insertAtomicBlockWithoutUnstyledBlock} from '../../util';


const addImage = (editorState, url, fileId, extraData = {}) => {
  const urlType = 'IMAGE';
  const data = {
    ...extraData, 
    fileId, 
    imageLoading: true,
    src: url,
  };

  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(urlType, 'IMMUTABLE', data);
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  
  const newContentState = contentState.mergeEntityData(entityKey, {
    entityKey,
  });
  
  const newEditorState = insertAtomicBlockWithoutUnstyledBlock(
    EditorState.push(editorState, newContentState),
    entityKey,
    ' '  
  );

  return EditorState.forceSelection(
    newEditorState,
    newEditorState.getCurrentContent().getSelectionAfter(),
  );
  
};

const updateImage = (editorState, url, fileId, extraData = {}) => {
  const contentState = editorState.getCurrentContent(); 
  const entityKey = getEntityKeyWithEntityData(editorState, 'fileId', fileId);
  console.log('entityKey get in updateImage: ', entityKey);
  let newContentState;
  if(entityKey){
    newContentState = contentState.mergeEntityData(entityKey, {
      ...extraData,
      imageLoading: false,
      src: url,
    });    
  }
  //return EditorState.push(editorState, newContentState);
  return EditorState.forceSelection(
    EditorState.push(editorState, newContentState),
    editorState.getSelection()  
  );
};

export {
  addImage,
  updateImage,
}