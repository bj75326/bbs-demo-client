import React, {Component} from 'react';
import {sideToolbarIcon} from '../../editorIcon';
import classNames from 'classnames';


export default class BlockTypeSelect extends Component{

  constructor(props){
    super(props);
    /*
    this.state = {
      visible: false  
    };
    */ 
    this.isDrawing = false;   
  }

  handleBtnMouseUp = e => {
    console.log('run handleBtnMouseUp in BlockTypeSelect');
    this.props.setPopupVisible(!this.props.visible) 
  }

  handleBtnMouseDown = e => {
    console.log('run handleBtnMouseDown in BlockTypeSelect');
    e.preventDefault();
  }

  handlePopupMouseDown = e => {
    console.log('run handlePopupMouseDown in BlockTypeSelect');
    this.isDrawing = true;
  }

  handlePopupMouseLeave = e => {
    console.log('run handlePopupMouseLeave in BlockTypeSelect');
    if(this.isDrawing){
      this.isDrawing = false;
      this.props.setForceVisible(false);  
    }
  }

  handlePopupMouseUp = e => {
    console.log('run handlePopupMouseUp in BlockTypeSelect');
    if(this.isDrawing){
      this.isDrawing = false;
    }
  }

  render(){
    const {theme, getEditorState, setEditorState, children, setForceVisible, visible} = this.props;

    //const {visible} = this.state;

    const sideButtonCls = classNames(theme.blockTypeSelectStyles.sideButton, {
      [theme.blockTypeSelectStyles.showBlockButtons]: visible
    }); 
    
    return (
      <div className={theme.blockTypeSelectStyles.wrapper}>
        <button 
          className={sideButtonCls} 
          onMouseUp={this.handleBtnMouseUp}
          onMouseDown={this.handleBtnMouseDown}
        >
          {sideToolbarIcon}
        </button>
        {visible && (
          <div 
            className={theme.blockTypeSelectStyles.popup}
            onMouseDown={this.handlePopupMouseDown}
            onMouseLeave={this.handlePopupMouseLeave}
            onMouseUp={this.handlePopupMouseUp}
          >
            <div className={theme.blockTypeSelectStyles.popupButtons}>
              {children({
                getEditorState,
                setEditorState,
                theme: theme.buttonStyles,
                setForceVisible,
                toolbarMode: 'inline',
              })}
            </div>
          </div>  
        )}
      </div>
    );
  }
} 