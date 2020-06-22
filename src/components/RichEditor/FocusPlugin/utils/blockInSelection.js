import getSelectedBlocksMapKeys from './getSelectedBlocksMapKeys';

export default (editorState, blockKey) => {
  const selectedBlocksMapKeys = getSelectedBlocksMapKeys(editorState);
  return selectedBlocksMapKeys.includes(blockKey);  
};