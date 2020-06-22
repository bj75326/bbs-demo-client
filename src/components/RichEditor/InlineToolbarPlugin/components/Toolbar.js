import React, {Component} from 'react';
import {getVisibleSelectionRect, EditorState} from 'draft-js';
import BoldButton from '../../Buttons/BoldButton';
import ItalicButton from '../../Buttons/ItalicButton';
import HeaderButton from '../../Buttons/HeaderButton';

export default class Toolbar extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      forceVisible: false,
      position: undefined,
      overrideContent: undefined,   
    };  
    
    this.isDrawing = false;
  }

  static defaultProps = {
    children: externalProps => (
      <div>
        <BoldButton {...externalProps}/>
        <ItalicButton {...externalProps}/>
        <HeaderButton {...externalProps}/>    
      </div>
    ),      
  };

  componentWillMount(){
    if(this.props.store){
      this.props.store.subscribeToItem('selection', this.onSelectionChanged);  
    }  
  }

  componentWillUnmount(){
    if(this.props.store){
      this.props.store.unsubscribeFromItem('selection', this.onSelectionChanged);
    }  
  }

  onSelectionChanged = () => {
    setTimeout(() => {
      if(!this.toolbar) return;
      const editorRef = this.props.store.getItem('getEditorRef')();
      if(!editorRef) return;
      
      let editorRoot = editorRef.refs && editorRef.refs.editor ? editorRef.refs.editor : editorRef.editor;
      while(editorRoot.className.indexOf('DraftEditor-root') < 0){
        editorRoot = editorRoot.parentNode;  
      }
      const editorRootRect = editorRoot.getBoundingClientRect();   
      
      const selectionRect = getVisibleSelectionRect(window);
      if(!selectionRect) return;

      const extraTopOffset = -8;

      const position = {
        top: 
          editorRoot.offsetTop +
          (selectionRect.top - editorRootRect.top) -
          this.toolbar.offsetHeight + 
          extraTopOffset,
        left: 
          editorRoot.offsetLeft + 
          (selectionRect.left - editorRootRect.left) +
          selectionRect.width / 2 - 
          this.toolbar.offsetWidth / 2, 
      };

      this.setState({
        position
      });
    });      
  }

  onOverrideContent = overrideContent => {
    this.setState({
      overrideContent,
    });
  }

  shouldShowToolbar = () => {
    const {getEditorState, forceInvisible} = this.props;
    const {overrideContent, forceVisible} = this.state;
    const selection = getEditorState().getSelection();
    console.log('selection.isCollapsed(): ', selection.isCollapsed());
    console.log('selection.getHasFocus(): ', selection.getHasFocus());
    if(forceInvisible) return false;

    return forceVisible || ((!selection.isCollapsed() && selection.getHasFocus()) || overrideContent);
  } 

  getToolbarRef = el => this.toolbar = el;

  setForceVisible = forceVisible => {
    this.setState({
      forceVisible
    });
  };

  handleMouseDown = e => {
    this.isDrawing = true;  
  }

  handleMouseLeave = e => {
    if(this.isDrawing){
      this.isDrawing = false;
      this.setForceVisible(false);  
    }  
  }

  handleMouseUp = e => {
    if(this.isDrawing){
      this.isDrawing = false;  
    }  
  }

  render(){
    const {theme, store, getEditorState} = this.props;
    const {overrideContent: OverrideContent, position} = this.state;
    
    const childrenProps = {
      theme: theme.buttonStyles,
      //getEditorState: store.getItem('getEditorState'),
      getEditorState,
      setEditorState: store.getItem('setEditorState'),
      onOverrideContent: this.onOverrideContent,
      toolbarMode: 'inline',
      showMode: 'tooltip',
      setForceVisible: this.setForceVisible
    };
    /*
    if(this.shouldShowToolbar()){
      return (
        <div
          className={theme.toolbarStyles.toolbar}
          style={position}
          ref={this.getToolbarRef}
        >
          {OverrideContent ? (
            <OverrideContent {...childrenProps}/>  
          ) : (
            this.props.children(childrenProps)
          )}  
        </div>
      );  
    }
    return null;
    */
    let style = {...position}; 
    if(!this.shouldShowToolbar()){
      style = {...style, display: 'none'}          
    }
    return (
      <div
        className={theme.toolbarStyles.toolbar}
        style={style}
        onMouseDown={this.handleMouseDown}
        onMouseLeave={this.handleMouseLeave}
        onMouseUp={this.handleMouseUp}
        ref={this.getToolbarRef}
      >
        {OverrideContent ? (
          <OverrideContent {...childrenProps}/>  
        ) : (
          this.props.children(childrenProps)
        )}  
      </div>  
    );
  }
}