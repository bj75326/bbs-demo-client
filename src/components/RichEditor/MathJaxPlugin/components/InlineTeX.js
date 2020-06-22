import React, {Component} from 'react';
import MathJaxNode from './MathJaxNode';
import {Modal} from 'antd';
import FormulaEditor from './FormulaEditor';
import {EditorState} from 'draft-js';

export default class InlineTeX extends Component {

  handleTeXClick = () => {
    const {store, entityKey} = this.props;
    const {getEditorState, setEditorState, setReadOnly} = store;
    
    const editorState = getEditorState();
    editorState.getCurrentContent().mergeEntityData(entityKey, {
      visible: true,
    });

    setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()));
    setReadOnly(true);
  }

  handleTeXKeyDown = e => {
    console.log('run handleTeXKeyDown!!!!!!!!!!');
    e.preventDefault();
    this.handleTeXClick();
  }

  handleCancel = () => {
    const {store, entityKey} = this.props;
    const {getEditorState, setEditorState, setReadOnly} = store;
    
    const editorState = getEditorState();
    editorState.getCurrentContent().mergeEntityData(entityKey, {
      visible: false,
    });
    setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()));
    setReadOnly(false);
  }

  handleConfirm = (value) => {
    const {store, entityKey} = this.props;
    const {getEditorState, setEditorState, setReadOnly} = store;
    
    const editorState = getEditorState();
    editorState.getCurrentContent().mergeEntityData(entityKey, {
      inputTeX: value,
      visible: false,
    });  
    setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()));
    setReadOnly(false);
  }
  
  render(){
    const {
      getEditorState,
      entityKey,
      theme
    } = this.props;

    const entity = getEditorState().getCurrentContent().getEntity(entityKey);
    const {inputTeX, visible = false} = entity.getData();

    return (
      <span>
        <span 
          className={theme.inlineTeXWrapper}
          contentEditable={false}
          onMouseDown={this.handleTeXClick}
          //onKeyDown={this.handleTeXKeyDown}
        >
          <MathJaxNode inline key={entityKey}>
            {inputTeX}
          </MathJaxNode>   
        </span>
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
      </span>
    );

  }
}