import React, {Component} from 'react';
import {EditorState} from 'draft-js';
import {undoIcon} from '../../editorIcon';
import {Tooltip} from 'antd';

export default class UndoButton extends Component {

  preventBubblingUp = e => {
    e.preventDefault();
  }

  shouldButtonDisabled = () => {
    return !this.props.getEditorState || this.props.getEditorState().getUndoStack().isEmpty();     
  }

  handleBtnClick = () => {
    this.props.setEditorState(
      EditorState.undo(this.props.getEditorState())
    );          
  }

  render(){
    const {theme} = this.props;

    return (
      <div
        className={theme.buttonWrapper}  
        onMouseDown={this.preventBubblingUp}
      >
        {this.shouldButtonDisabled() ? (
          <button
            className={theme.button}
            disabled
          >
            {undoIcon}
          </button>
        ) : (
          <Tooltip
            placement="bottom"
            title="Undo (⌘z)"
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
              {undoIcon}
            </button>  
          </Tooltip>  
        )}    
      </div>
    );
  }
}