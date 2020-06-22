import React, {Component} from 'react';
import createToolbarPlugin, {Separator} from './StaticToolbarPlugin';
import BoldButton from './Buttons/BoldButton';
import ItalicButton from './Buttons/ItalicButton';
import HeaderButton from './Buttons/HeaderButton';
import BlockquoteButton from './Buttons/BlockquoteButton';
import CodeBlockButton from './Buttons/CodeBlockButton';
import OrderedListButton from './Buttons/OrderedListButton';
import UnorderedListButton from './Buttons/UnorderedListButton';

import styles from './StaticToolbar.less';

const toolbarPlugin = createToolbarPlugin({
  theme: {
    buttonStyles: {
      button: styles.button,
      active: styles.active,
      buttonWrapper: styles.buttonWrapper,
      tooltipOverlayer: styles.tooltipOverlayer,  
    },
    toolbarStyles: {
      toolbar: styles.toolbar
    }
  }
});

const {Toolbar} = toolbarPlugin; 

export default class StaticToolbar extends Component {

  render(){
    const {getEditorState, LinkButton, ImageButton, DividerButton, MathJaxButton, UndoButton, RedoButton} = this.props;
    
    return (
      <Toolbar getEditorState={getEditorState}>
        {(externalProps) => (
          <div>
            <BoldButton {...externalProps}/>
            <ItalicButton {...externalProps}/>
            <Separator {...externalProps} className={styles.separator}/>
            <HeaderButton {...externalProps}/>
            <BlockquoteButton {...externalProps}/>
            <CodeBlockButton {...externalProps}/>
            <OrderedListButton {...externalProps}/>
            <UnorderedListButton {...externalProps}/>
            <Separator {...externalProps} className={styles.separator}/>    
            <LinkButton {...externalProps}/>
            <ImageButton {...externalProps}/>
            <MathJaxButton {...externalProps}/>   
            <DividerButton {...externalProps}/> 
            <Separator {...externalProps} className={styles.separator}/>
            <UndoButton {...externalProps}/>
            <RedoButton {...externalProps}/>
          </div>
        )}  
      </Toolbar>    
    );
  }
}

export {
  toolbarPlugin  
}