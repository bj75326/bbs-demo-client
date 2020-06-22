import React, {Component} from 'react';
import createSideToolbarPlugin from './SideToolbarPlugin';
import CodeBlockButton from './Buttons/CodeBlockButton';
import OrderedBlockButton from './Buttons/OrderedListButton';
import UnorderedBlockButton from './Buttons/UnorderedListButton';

import styles from './SideToolbar.less';

const sideToolbarPlugin = createSideToolbarPlugin({
  theme: {
    buttonStyles: {
      button: styles.button,
      active: styles.active,
      buttonWrapper: styles.buttonWrapper,
      tooltipOverlayer: styles.tooltipOverlayer,
    },
    toolbarStyles: {
      wrapper: styles.wrapper,    
    },
    blockTypeSelectStyles: {
      wrapper: styles.toolbar,
      sideButton: styles.sideButton,
      showBlockButtons: styles.showBlockButtons,
      popup: styles.popup,
      popupButtons: styles.popupButtons,
    }
  }
});

const {Toolbar} = sideToolbarPlugin;

export default class SideToolbar extends Component {
  
  render(){
    const {ImageButton, MathJaxButton, DividerButton, getEditorState, forceInvisible, refreshSideToolbar} = this.props;
    
    return (
      <Toolbar 
        getEditorState={getEditorState} 
        forceInvisible={forceInvisible} 
        refProp={instance => this.toolbarInstance = instance}
        refreshSideToolbar={refreshSideToolbar}
      >
        {(externalProps) => (
          <div>
            <ImageButton {...externalProps}/>
            <MathJaxButton {...externalProps}/>
            <DividerButton {...externalProps}/>
            <CodeBlockButton {...externalProps}/>
            <OrderedBlockButton {...externalProps}/>
            <UnorderedBlockButton {...externalProps}/>  
          </div>
        )}  
      </Toolbar>
    );
  }
};

export {
  sideToolbarPlugin
};