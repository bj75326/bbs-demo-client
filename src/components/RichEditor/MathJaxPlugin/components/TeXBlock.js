import React, {Component} from 'react';
import MathJaxNode from './MathJaxNode';
import FormulaEditor from './FormulaEditor';
import {Modal} from 'antd';
import {EditorState} from 'draft-js';

class TeXBlock extends Component {

  handleTeXClick = e => {
    
    const {store, block} = this.props;
    const {getEditorState, setEditorState, setReadOnly} = store;
    
    const editorState = getEditorState(); 
    const entityKey = block.getEntityAt(0);
    editorState.getCurrentContent().mergeEntityData(entityKey, {
      visible: true
    });
    setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()));  
    setReadOnly(true);
    
  }

  handleCancel = () => {
    
    const {store, block} = this.props; 
    const {getEditorState, setEditorState, setReadOnly} = store;
    
    const editorState = getEditorState();
    const entityKey = block.getEntityAt(0);
    editorState.getCurrentContent().mergeEntityData(entityKey, {
      visible: false
    });
    setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()));
    setReadOnly(false);
  }

  handleConfirm = (value) => {
    const {store, block} = this.props; 
    const {getEditorState, setEditorState, setReadOnly} = store;
    
    const editorState = getEditorState();
    const entityKey = block.getEntityAt(0);
    editorState.getCurrentContent().mergeEntityData(entityKey, {
      inputTeX: value,  
      visible: false,
    });
    setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()));
    setReadOnly(false);
  }

  render(){
    const {
      block,
      className,
      theme={},
      ...otherProps 
    } = this.props; 
    
    const {
      blockProps,
      customStyleMap,
      customStyleFn,
      decorator,
      forceSelection,
      offsetKey,
      selection,
      tree,
      contentState,
      blockStyleFn,
      editor,
      store,
      //onClick,
      onRender,
      ...elementProps
    } = otherProps;

    const {inputTeX, visible = false} = contentState.getEntity(block.getEntityAt(0)).getData();
    //const inputTeX = block.getData().get('inputTeX');
    //const visible = !!block.getData().get('visible');
    const editorState = store.getEditorState();

    return (
      <div>
        <div className={theme.TeXBlockWrapper} {...elementProps} 
          onMouseDown={this.handleTeXClick}
        >
          <MathJaxNode onRender={onRender.bind( null, editorState)}>
            {inputTeX}
          </MathJaxNode>
        </div>
        <Modal
          title="Update Formula"
          visible={visible}
          footer={null}
          width={550}
          destroyOnClose
          wrapClassName={theme.mathJaxModalWrapper}
          maskClosable={false}
          onCancel={this.handleCancel}
          maskStyle={{
            zIndex: 1031,
          }}
        >
          <FormulaEditor
            value={inputTeX}
            onCancel={this.handleCancel}
            onConfirm={this.handleConfirm}
          />
        </Modal> 
      </div>
    );
  }
}


export default TeXBlock;