import React, {Component} from 'react';
import createInlineToolbarPlugin from './InlineToolbarPlugin';
import BoldButton from './Buttons/BoldButton';
import ItalicButton from './Buttons/ItalicButton';
import HeaderButton from './Buttons/HeaderButton';
import BlockquoteButton from './Buttons/BlockquoteButton';

import styles from './InlineToolbar.less';

const inlineToolbarPlugin = createInlineToolbarPlugin({
  theme: {
    buttonStyles: {
      button: styles.button,
      active: styles.active,
      buttonWrapper: styles.buttonWrapper,
      tooltipOverlayer: styles.tooltipOverlayer,  
    },
    toolbarStyles: {
      toolbar: styles.toolbar,
    }      
  },
});

const {Toolbar} = inlineToolbarPlugin;

export default class InlineToolbar extends Component {
  
  render(){
    const {LinkButton, MathJaxButton, getEditorState, forceInvisible} = this.props; 
    
    return (
      <Toolbar getEditorState={getEditorState} forceInvisible={forceInvisible}>
        {(externalProps) => (
          <div>
            <BoldButton {...externalProps}/>
            <ItalicButton {...externalProps}/>
            <HeaderButton {...externalProps}/>
            <BlockquoteButton {...externalProps}/>
            <LinkButton {...externalProps}/> 
            <MathJaxButton {...externalProps}/>   
          </div>    
        )}
      </Toolbar>
    );
  }
};

export {
  inlineToolbarPlugin
};