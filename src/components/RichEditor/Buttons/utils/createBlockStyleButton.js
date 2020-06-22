import React, {Component} from 'react';
import {RichUtils} from 'draft-js';
import classNames from 'classnames';
import {Tooltip} from 'antd';
import checkButtonStatus from '../disableStrategy';

export default ({blockType, title, children}) => (
  class BlockStyleButton extends Component {

    toggleStyle = (e) => {
      e.preventDefault();
      this.props.setEditorState(
        RichUtils.toggleBlockType(
          this.props.getEditorState(),
          blockType,
        )
      );  
    }

    preventBubblingUp = (e) => {
      e.preventDefault();
    }

    blockTypeIsActive = () => {
      if(!this.props.getEditorState){
        return false;          
      }
      const editorState = this.props.getEditorState();
      const type = editorState
        .getCurrentContent()
        .getBlockForKey(editorState.getSelection().getStartKey())
        .getType();
      return type === blockType;  
    }

    shouldButtonDisabled = () => {
      if(!this.props.getEditorState){
        return false;  
      }
      const editorState = this.props.getEditorState();
      return checkButtonStatus(editorState, blockType);
    }

    render(){
      const {theme, toolbarMode} = this.props;
      
      const className = classNames(theme.button, {
        [theme.active]: this.blockTypeIsActive(),
      });

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
              className={className}
              type="button"
              children={children}
              disabled
            />  
          ) : (
            <Tooltip
              title={title}
              align={align}
              overlayClassName={theme.tooltipOverlayer}
            >
              <button
                className={className}
                onClick={this.toggleStyle}
                type="button"
                children={children}
              />    
            </Tooltip>
          )}
                  
        </div>
      );
    }
  }
);