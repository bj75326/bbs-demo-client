import React, {Component} from 'react';
import {dividerIcon} from '../../editorIcon';
import {Tooltip} from 'antd';
import checkButtonStatus from '../../Buttons/disableStrategy';


export default class DividerButton extends Component {

  preventBubblingUp = e => {
    e.preventDefault();  
  }

  shouldButtonDisabled = () => {
    if(!this.props.getEditorState){
      return false;  
    }  
    const editorState = this.props.getEditorState();
    return checkButtonStatus(editorState, 'DIVIDER');
  }

  handleBtnClick = e => {
    const {addDivider, getEditorState, setEditorState} = this.props; 
    const editorState = getEditorState(); 
    const newEditorState = addDivider(editorState);
    setEditorState(newEditorState);
  }

  render(){
    const {theme, toolbarMode} = this.props;

    const align = toolbarMode === 'inline' ? {
      points: ['bc', 'tc'],
      offset: [0, 0]
    } : {
      points: ['tc', 'bc'],
      offset: [0, 0]
    };
    
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
            {dividerIcon}  
          </button>  
        ) : (
          <Tooltip
            title="Insert Divider" 
            align={align}
            overlayClassName={theme.tooltipOverlayer}
          >
            <button
              className={theme.button}
              onClick={this.handleBtnClick}
              type="button"         
            >
              {dividerIcon}      
            </button>  
          </Tooltip>  
        )}  
      </div>      
    );
  }
}