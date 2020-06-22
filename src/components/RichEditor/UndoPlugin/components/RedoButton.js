import React, {Component} from 'react';
import {EditorState} from 'draft-js';
import {redoIcon} from '../../editorIcon';
import {Tooltip} from 'antd';

export default class RedoButton extends Component {
  
  preventBubblingUp = e => {
    e.preventDefault();
  }

  shouldComponentDisabled = () => {
    
      return !this.props.getEditorState || this.props.getEditorState().getRedoStack().isEmpty();  
    
  }

  handleBtnClick = () => {
    this.props.setEditorState(
      EditorState.redo(this.props.getEditorState())
    );    
  }

  render(){
    const {theme} = this.props;

    return (
      <div
        className={theme.buttonWrapper}
        onMouseDown={this.preventBubblingUp}
      >
        {this.shouldComponentDisabled() ? (
          <button
            className={theme.button}
            disabled
          >
            {redoIcon}
          </button>      
        ) : (
          <Tooltip
            placement="bottom"
            title="Redo (⌘⇧z)"
            align={{
              points: ['tc', 'bc'],
              offset: [0, 0]
            }}
            overlayClassName={theme.tooltipOverlayer}
          >
            <button
              className={theme.button} 
              onClick={this.handleBtnClick}
            >
              {redoIcon}
            </button>  
          </Tooltip>  
        )}  
      </div>  
    );
  }
}