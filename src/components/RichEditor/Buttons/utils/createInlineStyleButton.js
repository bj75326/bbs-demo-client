import React, {Component} from 'react';
import {RichUtils} from 'draft-js';
import classNames from 'classnames';
import {Tooltip} from 'antd';
import checkButtonStatus from '../disableStrategy';

export default ({style, title, children}) => (
  class InlineStyleButton extends Component {
    
    toggleStyle = (e) => {
      e.preventDefault();
      this.props.setEditorState(
        RichUtils.toggleInlineStyle(
          this.props.getEditorState(),
          style
        )
      );
    }

    preventBubblingUp = (e) => {e.preventDefault();}

    styleIsActive = () => this.props.getEditorState && this.props.getEditorState().getCurrentInlineStyle().has(style);

    shouldButtonDisabled = () => {
      if(!this.props.getEditorState){
        return false;          
      }
      const editorState = this.props.getEditorState();
      return checkButtonStatus(editorState, style);
    }

    render(){
      const {theme, toolbarMode} = this.props;
      const className = classNames(theme.button, {[theme.active]: this.styleIsActive()});  
      const align = toolbarMode === 'inline' ? {
        points: ['bc', 'tc'],
        offset: [0, 0],    
      } : {
        points: ['tc', 'bc'],
        offset: [0, 0],
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
              disabled
            >
              {children}
            </button>    
          ) : (
            <Tooltip
              placement="bottom"
              title={title}
              align={align}
              overlayClassName={theme.tooltipOverlayer}
            >
              <button
                className={className}
                onClick={this.toggleStyle}
                type="button" 
              >
                {children}
              </button>
            </Tooltip>  
          ) }
        </div>            
      );  
    }
  }
);