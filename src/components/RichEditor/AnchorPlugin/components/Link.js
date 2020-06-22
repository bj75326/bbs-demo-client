import React, { Component } from 'react';
import {Popover} from 'antd';
import UpdateButton from './UpdateButton';
import {EditorState} from 'draft-js';
import {getTextWithEntityKey} from '../../util';

const formatUrl = href => {
  if(!/^((ht|f)tps?):\/\//.test(href)){
    return `http://${href}`;
  }
  return href;
};

export default class Link extends Component {

  preventBubbling = e => {
    e.stopImmediatePropagation();  
  }

  componentDidUpdate(){
    setTimeout(()=>{
      if(this.popoverEl){
        this.popoverEl.removeEventListener('click', this.preventBubbling);
        this.popoverEl.addEventListener('click', this.preventBubbling);  
      }  
    }, 0);    
  }

  handleVisibleChange = visible => {
    //更新entityData
    const {store, entityKey} = this.props;
    const {getEditorState, setEditorState} = store;
    
    const editorState = getEditorState();
    editorState.getCurrentContent().mergeEntityData(entityKey, {
      visible
    });
    //只修改entityData 不会触发editorState的re-render
    setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()));
  }

  getLinkText = () => {
    /*
    const child = this.props.children[0];
    const selection = child.props.selection;
    const blockKey = selection.getAnchorKey();
    */
    const {offsetKey} = this.props;
    const blockKey = offsetKey.slice(0, offsetKey.indexOf('-'));
    const contentBlock = this.props.getEditorState().getCurrentContent().getBlockForKey(blockKey);
    return getTextWithEntityKey(contentBlock, this.props.entityKey);
  }
  
  render(){
    
    const {
      store,
      children, 
      entityKey,
      offsetKey,
      getEditorState,
      ownTheme,
      target="_blank",
      editor
    } = this.props;
    const entity = getEditorState().getCurrentContent().getEntity(entityKey);
    //const entity = contentState.getEntity(entityKey);
    const entityData = entity ? entity.get('data') : undefined;
    const href = (entityData && entityData.linkUrl) || undefined;
    const visible = entityData && entityData.visible;
    const modalVisible = entityData && entityData.modalVisible;
    const formattedHref = formatUrl(href);
    const blockKey = offsetKey.slice(0, offsetKey.indexOf('-'));
    console.log('try to get the link related blockKey: ', blockKey);

    const content = (
      <div className={ownTheme.linkPopoverContent} ref={el=> this.popoverEl = el} >
        <a
          className={ownTheme.linkPreview}
          title={formattedHref}
          href={formattedHref}
          target={target}
          rel="noopener noreferrer"
          onMouseDown={() => {console.log('mouseDown in the anchor')}}
          onMouseUp={() => {console.log('mouseUp in the anchor')}}
          onClick={e => { console.log('i clicked the anchor'); e.preventDefault();}}
        >{formattedHref}</a>
        <UpdateButton
          store={store}
          editor={editor}
          entityKey={entityKey}
          linkText={this.getLinkText()}
          linkUrl={href}
          blockKey={blockKey}
          visible={modalVisible}
          ownTheme={ownTheme}
        />
      </div>    
    );

    return (
      <Popover
        visible={visible}
        content={content}
        placement="bottom"
        trigger="click"
        onVisibleChange={this.handleVisibleChange}
        overlayClassName={ownTheme.linkPopover}
      >
        <a
          className={ownTheme.linkWrapper}
          title={href}
          href={href}
          target={target}
          rel="noopener noreferrer"
        >
          {children}  
        </a>
      </Popover>
    );
  }
}