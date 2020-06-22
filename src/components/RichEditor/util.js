
import {
  convertToRaw, 
  Modifier, 
  genKey, 
  ContentBlock, 
  BlockMapBuilder, 
  CharacterMetadata, 
  EditorState
} from 'draft-js';
import {List, Repeat, Map} from 'immutable';

export const getOffsetWithEntityKey = (contentBlock, entityKey) => {
  let startOffset, endOffset;
  contentBlock.findEntityRanges(character => {
    return character.getEntity() === entityKey;  
  }, (start, end) => {
    startOffset = start;
    endOffset = end;
  });
  return [startOffset, endOffset];
};

export const getTextWithEntityKey = (contentBlock, entityKey) => {
  const offset = getOffsetWithEntityKey(contentBlock, entityKey);
  return contentBlock.getText().slice(offset[0], offset[1]);  
};

export const isAtEndOfBlock = (contentState, selection) => {
  const currentBlockKey = selection.getAnchorKey();
  const contentBlock = contentState.getBlockForKey(currentBlockKey);
  return contentBlock.getText().length === selection.getStartOffset();    
};

/*
export const getBlockKeyWithEntityData = (editorState, key, value) => {
  const contentState = editorState.getCurrentContent();
  
  const rawContentState = convertToRaw(contentState);

  return rawContentState.blocks.filter(block => {
    if(block.entityRanges[0]){
      return rawContentState.entityMap[block.entityRanges[0].key].data[key] === value;  
    }
    return false;
  })[0].key;
  
};
*/

export const getEntityKeyWithEntityData = (editorState, key, value) => {
  const contentState = editorState.getCurrentContent();

  const rawContentState = convertToRaw(contentState);
  const entityMapKey = Object.keys(rawContentState.entityMap).filter(entityMapKey => rawContentState.entityMap[entityMapKey].data[key] === value)[0];
  return rawContentState.entityMap[entityMapKey].data['entityKey'];
}

export const isLastBlock = (contentState, currentKey) => {
  return !contentState.getBlockAfter(currentKey);
}

export const isFirstBlock = (contentState, currentKey) => {
  return !contentState.getBlockBefore(currentKey);
}

const calculateSelectionAfter = (contentState, divideBlockNeeded) => {
  if(divideBlockNeeded){
    return contentState.getSelectionAfter().set('hasFocus', true);  
  }
  const blockAfterKey = contentState.getBlockAfter(contentState.getSelectionAfter().getStartKey()).getKey();
  return contentState.getSelectionAfter().merge({
    anchorKey: blockAfterKey,
    anchorOffset: 0,
    focusKey: blockAfterKey,
    focusOffset: 0,
    isBackward: false, 
  });
}

export const insertAtomicBlockWithoutUnstyledBlock = (
  editorState, 
  entityKey, 
  character,
  data = undefined,
) => {
  
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  const afterRemoval = Modifier.removeRange(
    contentState,
    selectionState,
    'backward'
  );

  const targetSelection = afterRemoval.getSelectionAfter();

  const startKey = targetSelection.getStartKey();
  const currentBlock = afterRemoval.getBlockForKey(startKey);
  
  let atomicBlockConfig = {
    key: genKey(),
    type: 'atomic',
  };
  if(data){
    atomicBlockConfig = {
      ...atomicBlockConfig,
      data: Map(data),
    }
  }else {
    const charData = CharacterMetadata.create({entity: entityKey});
    atomicBlockConfig = {
      ...atomicBlockConfig,
      text: character,
      characterList: List(Repeat(charData, character.length)),          
    };
  }

  let atomicDividerBlockConfig = null;
  const fragmentArray = [
    new ContentBlock(atomicBlockConfig)  
  ];
  
  if(currentBlock.getType() === 'unstyled' && !currentBlock.getText() && !isFirstBlock(afterRemoval, startKey)){
    const asAtomicBlock = Modifier.setBlockType(
      afterRemoval,
      targetSelection,
      'atomic',
    );

    if(isLastBlock(asAtomicBlock, startKey)){
      atomicDividerBlockConfig = {
        key: genKey(),
        type: 'unstyled',  
      }    
      fragmentArray.push(new ContentBlock(atomicDividerBlockConfig));  
    }

    const fragment = BlockMapBuilder.createFromArray(fragmentArray);
    
    const withAtomicBlock = Modifier.replaceWithFragment(
      asAtomicBlock,
      targetSelection,
      fragment,
    );

    const newContent = withAtomicBlock.merge({
      selectionBefore: selectionState,
      selectionAfter: calculateSelectionAfter(withAtomicBlock, isLastBlock(asAtomicBlock, startKey)),
    });

    return EditorState.push(editorState, newContent, 'insert-fragment');
  }

  
  const afterSplit = Modifier.splitBlock(afterRemoval, targetSelection);
  let insertionTarget = afterSplit.getSelectionAfter();

  const insertionTargetBlock = afterSplit.getBlockForKey(insertionTarget.getStartKey());

  let dividerBlockNeeded = !!(insertionTargetBlock.getText() ||
    (!insertionTargetBlock.getText() && isLastBlock(afterSplit, insertionTarget.getStartKey())));

  const prevBlock = afterSplit.getBlockBefore(insertionTarget.getStartKey());
  if(!prevBlock.getText() && !isFirstBlock(afterSplit, prevBlock.getKey())){
    insertionTarget = afterSplit.getSelectionBefore();   
    dividerBlockNeeded = false;
  }
  
  if(dividerBlockNeeded){
    atomicDividerBlockConfig = {
      key: genKey(),
      type: 'unstyled',  
    }    
    fragmentArray.push(new ContentBlock(atomicDividerBlockConfig));    
  }
  const fragment = BlockMapBuilder.createFromArray(fragmentArray);
  
  const asAtomicBlock = Modifier.setBlockType(
    afterSplit,
    insertionTarget,
    'atomic',
  );

  const withAtomicBlock = Modifier.replaceWithFragment(
    asAtomicBlock,
    insertionTarget,
    fragment,
  );

  const newContent = withAtomicBlock.merge({
    selectionBefore: selectionState,
    selectionAfter: calculateSelectionAfter(withAtomicBlock, dividerBlockNeeded), 
    //selectionAfter: withAtomicBlock.getSelectionAfter().set('hasFocus', true),
  });

  return EditorState.push(editorState, newContent, 'insert-fragment');
  
}
