import React, {Component} from 'react';
import Editor from 'draft-js-plugins-editor';
import {EditorState, convertToRaw, Modifier} from 'draft-js';
import styles from './index.less';
import classNames from 'classnames';


const customBlockStyleFn = (contentBlock) => {
  const type = contentBlock.getType();

  switch(type) {
    case 'blockquote':
      return 'richEditor-blockquote';
    case 'header-two': 
      return 'richEditor-header';
    case 'code-block':
      return 'richEditor-codeblock';
    case 'ordered-list-item':
      return 'richEditor-orderedlist';
    case 'unordered-list-item':
      return 'richEditor-unorderedlist';
    default:
      return 'richEditor-paragraph';
  }
};

const customKeyBindingFn = (e) => {
  if(e.keyCode){
    console.log('keyboard event', e.keyCode);
  }
};


const getBlockIndex = (blockKey, rawContentState) => {
  if(rawContentState.blocks && rawContentState.blocks.length >= 0){
    return rawContentState.blocks.findIndex(block => {
      return block.key === blockKey;
    });  
  }
  return -1;
};

const getLineBreakIndex = (str) => {
  console.log('input: ', str);
  const pattern = /\n/g;
  const result = [];
  let ans;
  do{
    ans = pattern.exec(str);
    console.log('ans: ', ans)
    if(ans) result.push(ans.index);  
  }
  while (ans !== null)  
  return result;
}

const getRowNumber = (offset, lineBreakIndex) => {
  if(!lineBreakIndex.length){
    return 1;
  }
  return lineBreakIndex.filter(position => {
    return offset > position;  
  }).length + 1;
};

//处理单独block
const insertTabSpaceForBlock = (contentState, selection, blockKey, startRow, endRow) => {
  let newContentState = contentState;
  const lineBreakIndex = getLineBreakIndex(newContentState.getBlockForKey(blockKey).getText());
  if(startRow === 1){
    newContentState = Modifier.insertText(newContentState, selection.merge({
      anchorOffset: 0,
      focusOffset: 0,
      anchorKey: blockKey,
      focusKey: blockKey,
    }), '  ');  
  }

  for(let i=0; i<lineBreakIndex.length; i++){
    if(i + 2 >= startRow && i + 1 < endRow){
      const offset = getLineBreakIndex(newContentState.getBlockForKey(blockKey).getText())[i];
      newContentState = Modifier.insertText(newContentState, selection.merge({
        anchorOffset: offset + 1,
        focusOffset: offset + 1,
        anchorKey: blockKey,
        focusKey: blockKey,
      }), '  ');
    }  
  }

  return newContentState;
};

const countSpaceAtStrStart = (str) => {
  if(str.search){
    return str.search(/\S/);  
  }
  return -1;
};

const avoidLineFeed = (offset, indent, contentState, blockKey, row) => {
  let newOffset = offset - indent;
  const lineBreakIndex = getLineBreakIndex(contentState.getBlockForKey(blockKey).getText());
  const lineBreakOffset = row === 1 ? 0 : lineBreakIndex[row - 2] + 1;
  return newOffset < lineBreakOffset ? lineBreakOffset : newOffset;
};

const removeTabSpaceForBlock = (contentState, selection, blockKey, startRow, endRow) => {
  let newContentState = contentState;
  let indentDistance = 0;
  const lineBreakIndex = getLineBreakIndex(newContentState.getBlockForKey(blockKey).getText());
  const lines = newContentState.getBlockForKey(blockKey).getText().split('\n');
  if(startRow === 1){
    const amountForSpace = countSpaceAtStrStart(lines[0]);
    if(amountForSpace === 1){
      indentDistance = indentDistance + 1;
      newContentState = Modifier.replaceText(newContentState, selection.merge({
        anchorOffset: 0,
        focusOffset: 1,  
        isBackward: false,
        anchorKey: blockKey,
        focusKey: blockKey,
      }), '');    
    }else if(amountForSpace >= 2){
      indentDistance = indentDistance + 2;
      newContentState = Modifier.replaceText(newContentState, selection.merge({
        anchorOffset: 0,
        focusOffset: 2,  
        isBackward: false,
        anchorKey: blockKey,
        focusKey: blockKey,
      }), '');  
    }
  }

  for(let i=0; i<lineBreakIndex.length; i++){
    if(i + 2 >= startRow && i + 1 < endRow){
      const offset = getLineBreakIndex(newContentState.getBlockForKey(blockKey).getText())[i];
      const amountForSpace = countSpaceAtStrStart(lines[i+1]);
      if(amountForSpace === 1){
        indentDistance = indentDistance + 1;
        newContentState = Modifier.replaceText(newContentState, selection.merge({
          anchorOffset: offset + 1,
          focusOffset: offset + 2,
          isBackward: false,
          anchorKey: blockKey, 
          focusKey: blockKey,
        }), '');  
      }else if(amountForSpace >= 2){
        indentDistance = indentDistance + 2;
        newContentState = Modifier.replaceText(newContentState, selection.merge({
          anchorOffset: offset + 1,
          focusOffset: offset + 3,
          isBackward: false,
          anchorKey: blockKey,
          focusKey: blockKey,
        }), '');  
      }

    }  
  }
  
  return {
    newContentState,
    indentDistance,
  };
};

export default class RichEditor extends Component {
  constructor(props){
    super(props);
    this.startToEdit = false;
    this.leavePosition = {};
  }

  componentDidUpdate(_, prevState){
    console.log('richEditor componentDidUpdate');
  }
  
  onChange = editorState => {
    console.log('onchange triggered');
    console.log('curr : ', editorState.getSelection().getStartOffset());
    console.log('startKey:', editorState.getSelection().getStartKey());
    console.log('endKey : ', editorState.getSelection().getEndKey());
    console.log('entityKey: ', editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getEntityAt(editorState.getSelection().getStartOffset()));
    console.log('convert: ', convertToRaw( editorState.getCurrentContent()));
    const {onChange} = this.props;
    onChange(editorState);
  }

  handleKeydown = (e) => {
    console.log('wrapper handleKeyDwon!!!!! ', e.keyCode);
    console.log('wrapper handleKeyDown e.target: ', e.target);
    if(e.keyCode === 9 && e.shiftKey === false){
      //只有作用在单独的codeblock内或者从start block一直到end block（包括）全是code block
      const {editorState} = this.props;
      const contentState = editorState.getCurrentContent();
      const selection = editorState.getSelection();
      const rawContentState = convertToRaw(contentState);

      const startKey = selection.getStartKey();
      const endKey = selection.getEndKey();
      const startBlock = contentState.getBlockForKey(startKey);

      if(selection.isCollapsed() && startBlock.getType() !== 'code-block'){
        return;    
      }

      if(!selection.isCollapsed()){
        const startIndex = getBlockIndex(startKey, rawContentState);
        const endIndex = getBlockIndex(endKey, rawContentState);  
        const selectedBlocks = rawContentState.blocks.slice(startIndex, endIndex + 1);
        if(selectedBlocks.some(block => {
          return block.type !== 'code-block';      
        })){
          return;  
        }
        const startOffset = selection.getStartOffset();
        const endOffset = selection.getEndOffset();
        const anchorOffset = selection.getAnchorOffset();
        const focusOffset = selection.getFocusOffset();

        let newContentState = contentState;
        let newAnchorOffset = anchorOffset;
        let newFocusOffset = focusOffset;

        if(startKey === endKey  ){
          const currentBlock = contentState.getBlockForKey(startKey);
          const lineBreakIndex = getLineBreakIndex(currentBlock.getText());
          const startRow = getRowNumber(startOffset, lineBreakIndex);
          const endRow = getRowNumber(endOffset, lineBreakIndex);

          if(startRow !== endRow){
            
            newContentState = insertTabSpaceForBlock(contentState, selection, startKey, startRow, endRow);

            if(focusOffset > anchorOffset){
              newAnchorOffset = anchorOffset + 2;
              newFocusOffset = focusOffset + (endRow - startRow + 1) * 2;    
            }else {
              newAnchorOffset = anchorOffset + (endRow - startRow + 1) * 2;
              newFocusOffset = focusOffset + 2;
            }  
          } else {
            newContentState = Modifier.replaceText(contentState, selection, '  '); 
            if(focusOffset > anchorOffset){
              newAnchorOffset = anchorOffset + 2;
              newFocusOffset = newAnchorOffset;  
            }else {
              newFocusOffset = focusOffset + 2;
              newAnchorOffset = newFocusOffset;  
            }
          }
        }else {
          const startBlock = contentState.getBlockForKey(startKey);
          const startBlockLineBreakIndex = getLineBreakIndex(startBlock.getText());
          const startBlockStartRow = getRowNumber(startOffset, startBlockLineBreakIndex);
          
          newContentState = insertTabSpaceForBlock(contentState, selection, startKey, startBlockStartRow, startBlockLineBreakIndex.length + 1);

          const endBlock = contentState.getBlockForKey(endKey);
          const endBlockLineBreakIndex = getLineBreakIndex(endBlock.getText());
          const endBlockEndRow = getRowNumber(endOffset, endBlockLineBreakIndex);

          newContentState = insertTabSpaceForBlock(newContentState, selection, endKey, 1, endBlockEndRow);

          selectedBlocks.slice(1, -1).forEach((block, index) => {
            const contentBlock = newContentState.getBlockForKey(block.key);
            const blockLineBreakIndex = getLineBreakIndex(contentBlock.getText());
            newContentState = insertTabSpaceForBlock(newContentState, selection, block.key, 1, blockLineBreakIndex.length + 1);   
          });
          
          if(!selection.isBackward){
            newAnchorOffset =  anchorOffset + 2;
            newFocusOffset = focusOffset + endBlockEndRow * 2;  
          }else{
            newFocusOffset = focusOffset + 2;
            newAnchorOffset = anchorOffset + endBlockEndRow * 2;
          }

        }
        this.onChange(EditorState.forceSelection(EditorState.push(
          editorState,
          newContentState,
          //'change-block-data'
        ), selection.merge({
          focusOffset: newFocusOffset,
          anchorOffset: newAnchorOffset,  
        })));
      
      }else {
        const newContentState = Modifier.insertText(contentState, selection, '  ');
        this.onChange(EditorState.push(
          editorState,
          newContentState,
          //'change-block-data'
        ));    
      }

      e.preventDefault();
    }

    if(e.keyCode === 9 && e.shiftKey === true){
      const {editorState} = this.props.editorState;
      const contentState = editorState.getCurrentContent();
      const selection = editorState.getSelection();
      const rawContentState = convertToRaw(contentState);

      const startKey = selection.getStartKey();
      const endKey = selection.getEndKey();
      const startBlock = contentState.getBlockForKey(startKey);

      if(selection.isCollapsed() && startBlock.getType() !== 'code-block'){
        return;  
      }

      if(!selection.isCollapsed()){
        const startIndex = getBlockIndex(startKey, rawContentState);
        const endIndex = getBlockIndex(endKey, rawContentState);  
        const selectedBlocks = rawContentState.blocks.slice(startIndex, endIndex + 1);
        if(selectedBlocks.some(block => {
          return block.type !== 'code-block';
        })){
          return ;
        }

        const startOffset = selection.getStartOffset();
        const endOffset = selection.getEndOffset();
        const anchorOffset = selection.getAnchorOffset();
        const focusOffset = selection.getFocusOffset();

        let newContentState = contentState;
        let newAnchorOffset = anchorOffset;
        let newFocusOffset = focusOffset;

        if(startKey === endKey){
          const currentBlock = contentState.getBlockForKey(startKey);
          const lineBreakIndex = getLineBreakIndex(currentBlock.getText());
          const startRow = getRowNumber(startOffset, lineBreakIndex);
          const endRow = getRowNumber(endOffset, lineBreakIndex);
          const lines = currentBlock.getText().split(/\n/);
          const startRowAmountForSpace = countSpaceAtStrStart(lines[startRow - 1]);

          const removedState = removeTabSpaceForBlock(contentState, selection, startKey, startRow, endRow);

          newContentState = removedState.newContentState;

          if(anchorOffset < focusOffset){ 
            newAnchorOffset = avoidLineFeed(anchorOffset
              , startRowAmountForSpace <= 1 ? startRowAmountForSpace : 2
              , newContentState
              , startKey
              , startRow
            );
            newFocusOffset = avoidLineFeed(focusOffset
              , removedState.indentDistance
              , newContentState
              , startKey
              , endRow
            );
          }else{
            newFocusOffset = avoidLineFeed(focusOffset
              , startRowAmountForSpace <= 1 ?  startRowAmountForSpace : 2
              , newContentState
              , startKey
              , startRow
            );
            newAnchorOffset = avoidLineFeed(anchorOffset
              , removedState.indentDistance
              , newContentState
              , startKey
              , endRow
            );
          }
        }else {
          const startBlock = newContentState.getBlockForKey(startKey);
          const startBlockLineBreakIndex = getLineBreakIndex(startBlock.getText());
          const startBlockStartRow = getRowNumber(startOffset, startBlockLineBreakIndex);
          const startBlockLines = startBlock.getText().split(/\n/);
          const startRowAmountForSpace = countSpaceAtStrStart(startBlockLines[startBlockStartRow - 1]);
          
          let removedState = removeTabSpaceForBlock(newContentState, selection, startKey, startBlockStartRow, startBlockLineBreakIndex.length + 1);
          newContentState = removedState.newContentState;
          const endBlock = newContentState.getBlockForKey(endKey);
          const endBlockLineBreakIndex = getLineBreakIndex(endBlock.getText());
          const endBlockEndRow = getRowNumber(endOffset, endBlockLineBreakIndex);
          
          removedState = removeTabSpaceForBlock(newContentState, selection, endKey, 1, endBlockEndRow);
          newContentState = removedState.newContentState;
          const indentDistance = removedState.indentDistance;

          selectedBlocks.slice(1, -1).forEach((block, index) => {
            const contentBlock = newContentState.getBlockForKey(block.key);
            const blockLineBreakIndex = getLineBreakIndex(contentBlock.getText());
            newContentState = removeTabSpaceForBlock(newContentState, selection, block.key, 1, blockLineBreakIndex.length + 1).newContentState;  
          });

          
          if(!selection.isBackward){ 
            newAnchorOffset = avoidLineFeed(anchorOffset
              , startRowAmountForSpace <=1 ? startRowAmountForSpace : 2
              , newContentState
              , startKey
              , startBlockStartRow
            );
            newFocusOffset = avoidLineFeed(focusOffset
              , indentDistance
              , newContentState
              , endKey
              , endBlockEndRow  
            );
          }else {
            newFocusOffset = avoidLineFeed(focusOffset
              , startRowAmountForSpace <=1 ? startRowAmountForSpace : 2
              , newContentState
              , startKey
              , startBlockStartRow
            );
            newAnchorOffset = avoidLineFeed(anchorOffset
              , indentDistance
              , newContentState
              , endKey
              , endBlockEndRow
            );
          }
        }

        this.onChange(EditorState.forceSelection(EditorState.push(
          editorState,
          newContentState,
          //'change-block-data'
        ), selection.merge({
          anchorOffset: newAnchorOffset,
          focusOffset: newFocusOffset,  
        })));

      }else{
        const lineBreakIndex = getLineBreakIndex(startBlock.getText());
        const row = getRowNumber(selection.getStartOffset(), lineBreakIndex);
        const offset = row === 1 ? 0 : lineBreakIndex[row - 2];
        const amountForSpace = countSpaceAtStrStart(startBlock.getText().split(/\n/)[row-1]);
        let newContentState = Modifier.replaceText(contentState, selection.merge({
          anchorOffset: row === 1 ? 0 : offset + 1,
          focusOffset:  row === 1 ? (amountForSpace <= 1 ? amountForSpace : 2) : (amountForSpace <= 1 ?  offset + 1 + amountForSpace : offset + 3 ),
          isBackward: false,
          anchorKey: startKey,
          focusKey: startKey,
        }), '');
        this.onChange(EditorState.forceSelection(EditorState.push(
          editorState,
          newContentState,
        ), selection.merge({
          focusOffset: selection.focusOffset - (amountForSpace <= 1 ? amountForSpace : 2),
          anchorOffset: selection.anchorOffset - (amountForSpace <= 1 ? amountForSpace : 2),
        })));        
      }

      e.preventDefault();  
    }
  }

  
  keyBindingFn = (e) => {
    console.log('props keyBindingFn:!!!!!!!!!! ', e.keyCode);
    console.log('keyBindingFn e.target', e.target);
    const {editorState} = this.props;
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const startKey = selection.getStartKey();
    const startBlockType = contentState.getBlockForKey(startKey).getType();
    if(e.keyCode === 13 && startBlockType === 'code-block'){
      
      if(selection.isCollapsed()){
        const nextContentState = Modifier.insertText(contentState, selection, '\n');
        this.onChange(EditorState.push(
          editorState,
          nextContentState,
          'insert-characters'
        ));
      }

      return 'stop-enter';
    }  
  }

  handleKeyCommand = (command) => {
    if(command === 'stop-enter'){
      return 'not-handled';
    }
  }

  shouldHidePlaceholder(editorState){
    const contentState = editorState.getCurrentContent();
    return (
      contentState.hasText() ||
      contentState
        .getBlockMap()
        .first()
        .getType() !== 'unstyled' 
    );  
  }

  handleEditorFocus = () => {
    console.log('real editor focus');
    const {toolbarMode, setForceInvisible} = this.props;
    if(toolbarMode === 'inline'){
      setForceInvisible(true);
      this.startToEdit = true;
    }
  }

  handleWrapperMouseUp = () => {
    console.log('editor mouseup');
    const {toolbarMode, setForceInvisible, forceInvisible} = this.props;
    if(toolbarMode === 'inline' && forceInvisible){
      setForceInvisible(false);
    }
  }

  handleWrapperClick = () => {
    console.log("editor clicked");
    const {toolbarMode, editorState, refreshSideToolbar, refreshInlineToolbar} = this.props;
    if(toolbarMode === 'inline' && this.startToEdit){
      this.startToEdit = false;
      const sideToolbarVisible = this.props.getSideToolbarVisibleValue();
      const selection = editorState.getSelection();
      const contentState = editorState.getCurrentContent();
      const startKey = selection.getStartKey();
      const endKey = selection.getEndKey();
      const startBlock = contentState.getBlockForKey(startKey);
      if(startKey === endKey && startBlock.getType() === 'unstyled' && startBlock.getLength() <= 0 && !sideToolbarVisible){
        refreshSideToolbar(editorState);       
      }
      if(!selection.isCollapsed()){
        refreshInlineToolbar(editorState);
      }
    }
  }

  /*
  lockOrUnlockEditor = (readOnly) => {
    this.setState({
      readOnly,
    }, () => {
      console.log('readonly: ', this.state.readOnly);
    });
  }*/

  //draft-js-plugin-editor的bug导致在static toolbar的子组件中getEditorState总是获取上一个state的数据
  /*
  getEditorState = () => {
    return this.state.editorState;
  }
  */

  render(){
    const {editorState, readOnly, plugins} = this.props;

    const richTextCls = classNames(styles.richText, {
      [styles.hidePlaceholder] : this.shouldHidePlaceholder(editorState),
    });
    
    return (
      <div 
        className={richTextCls} 
        onBlur={()=>{console.log('editor blur')}} 
        onClick={this.handleWrapperClick} 
        onMouseDown={()=>{console.log('editor mouse down')}}
        //onMouseUp={()=>{console.log('editor mouse up')}}
        onMouseUp={this.handleWrapperMouseUp}
        onKeyDown={this.handleKeydown}
      >
        <Editor
          editorState={editorState}
          onChange={this.onChange}

          //onFocus={()=>{console.log('real editor focus')}}
          onFocus={this.handleEditorFocus}
          onMouseDown={()=>{console.log('real editor mouse down')}}
          onMouseUp={()=>{console.log('real editor mouse up')}}
          onBlur={()=>{console.log('real editor blur')}}
          onClick={()=>{console.log('real editor Click')}}

          plugins={plugins}
          ref={element => {this.editor = element;}}
          readOnly={readOnly}
          blockStyleFn={customBlockStyleFn}
          keyBindingFn={this.keyBindingFn}
          handleKeyCommand={this.handleKeyCommand}
          placeholder="Say something..."
        />
      </div>
    );
  }
}
