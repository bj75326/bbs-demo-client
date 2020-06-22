import React, {Component} from 'react';
import classNames from 'classnames';
import {Popover} from 'antd';
import {EditorState} from 'draft-js';
import {photoSizeSmall, photoSizeLarge} from '../../editorIcon';

export default class Image extends Component {

  preventBubbling = e => {
    e.stopImmediatePropagation();
  }

  componentDidUpdate(){

    const {store: {getEditorState, setEditorState}, block, editor, blockProps: {isFocused}} = this.props;
    const entityKey = block.getEntityAt(0);
    const editorState = getEditorState();
    const contentState = editorState.getCurrentContent();
    const {visible, noFocus, width, showResizer} = contentState.getEntity(entityKey).getData();
    
    if(visible){
      setTimeout(() => {
        if(this.textareaEl && document.activeElement !== this.textareaEl){
          this.textareaEl.select();    
        }  
      }, 0);  
    }

    if(isFocused && !noFocus && +width >= 600 && showResizer){
      setTimeout(() => {
        if(this.resizerEl){
          this.resizerEl.removeEventListener('click', this.preventBubbling);
          this.resizerEl.addEventListener('click', this.preventBubbling);    
        }  
      }, 0);  
    }
    
    if((!isFocused || noFocus) && +width >= 600 && showResizer){
      contentState.mergeEntityData(entityKey, {
        showResizer: false,
      });
      editor.forceSync = true;
      setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()));  
    }

    if(isFocused && !noFocus && +width >= 600 && !showResizer){
      const boundingClientRect = this.imageEl.getBoundingClientRect();
      const {top} = boundingClientRect;
      
      let placement = 'bottom';
      if(top >= 88){
        placement = 'top';  
      }
      contentState.mergeEntityData(entityKey, {
        placement,
        showResizer: true,
      }); 
      editor.forceSync = true;
      setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()));     
    }
    
  }

  handleVisibleChange = visible => {
    const {store, block, editor} = this.props;
    const {getEditorState, setEditorState} = store;
    const entityKey = block.getEntityAt(0);
    const editorState = getEditorState();
    editorState.getCurrentContent().mergeEntityData(entityKey, {
      visible  
    });
    editor.forceSync = true;     
    setEditorState(EditorState.forceSelection(
        editorState, editorState.getSelection()
      )
    ); 
    
    editor.lockOrUnlockEditor(visible);    
  }

  handleTextareaChange = e => {

    const scrollHeight = this.textareaEl.scrollHeight;
    const rows = scrollHeight / 20;

    const {store, block} = this.props;
    const {getEditorState, setEditorState} = store;
    const entityKey = block.getEntityAt(0);
    const editorState = getEditorState();
    editorState.getCurrentContent().mergeEntityData(entityKey, {
      comment: e.target.value,
      rows,
    });
    this.props.editor.forceSync = true; 
    setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()));
  }

  /*
  handleTextareaBlur = e => {
    console.log('textarea Blur happen!!!!');
    const {store, block} = this.props;
    const {getEditorState, setEditorState} = store;
    const entityKey = block.getEntityAt(0);
    const editorState = getEditorState();
    const updatedContentState = editorState.getCurrentContent().mergeEntityData(entityKey, {
      noFocus: false,  
    });   
    setEditorState(EditorState.forceSelection(EditorState.push(editorState, updatedContentState), editorState.getSelection()));
  }
  */

  handleImageClick = e => {
    const {store, block, blockProps} = this.props;
    const {setSelectionToBlock} = blockProps;
    const {getEditorState, setEditorState} = store; 
    const editorState = getEditorState();
    /*
    const entityKey = block.getEntityAt(0); 
    const boundingClientRect = this.imageEl.getBoundingClientRect(); 
    const {top} = boundingClientRect;

    let placement = 'bottom';
    if(top >= 88){
      placement = 'top'; 
    }  
    editorState.getCurrentContent().mergeEntityData(entityKey, {
      placement
    });
    */
    this.props.editor.forceSync = true;
    setSelectionToBlock(getEditorState, setEditorState, block, editorState);

  }

  handleFigcaptionMouseUp = e => {
    //MouseUp on figcaption will not make image focused
    const {store, block} = this.props;
    const {getEditorState, setEditorState} = store;
    const entityKey = block.getEntityAt(0);
    const editorState = getEditorState();
    editorState.getCurrentContent().mergeEntityData(entityKey, {
      noFocus: true,        
    });
    this.props.editor.forceSync = true;
    setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()));
  }

  handleImageSizeChange = size => {
    const {store, block} = this.props; 
    const {getEditorState, setEditorState} = store;
    const entityKey = block.getEntityAt(0);
    const editorState = getEditorState();
    editorState.getCurrentContent().mergeEntityData(entityKey, {
      size
    });
    this.props.editor.forceSync = true;
    setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()));
  }

  handleSmallSizeChange = e => {
    this.handleImageSizeChange('S');  
  }

  handleLargeSizeChange = e => {
    this.handleImageSizeChange('L');
  }

  render(){
    const {
      block,
      className,
      theme={},
      ...otherProps
    } = this.props;

    const {
      blockProps,
      customStyleMap,
      customStyleFn,
      decorator,
      forceSelection,
      offsetKey,
      selection,
      tree,
      contentState,
      blockStyleFn,
      editor,
      store,
      onClick,
      onLoad,
      ...elementProps
    } = otherProps;

    const {isFocused} = blockProps;

    const {
      src, 
      visible, 
      comment, 
      rows = 1, 
      width, 
      noFocus, 
      size = 'L',
      placement = 'bottom',
      showResizer = false
    } = contentState.getEntity(block.getEntityAt(0)).getData();

    const combinedClassName = classNames(
      theme.image, 
      className,
      {
        [theme.imageFocused]: isFocused && !noFocus,
        [theme.imageUnfocused]: !isFocused || noFocus,
        [theme.smallSize]: size === 'S',
      },
    );
    
    let resizerVisible = false;

    if(+width >= 600){
      resizerVisible = isFocused && !noFocus && showResizer;
    }
    
    const content = (
      <div>
        <textarea
          placeholder="Add image comments (Not more than 140 characters)"
          ref={el => this.textareaEl = el}
          rows={rows}
          value={comment}
          onChange={this.handleTextareaChange}
          maxLength={140}
        />        
      </div>
    );
    
    const resizerContent = (
      <div className={theme.resizerWrapper} ref={el => this.resizerEl = el}>
        <button type="button" className={`${theme.resizerButton} ${size === 'S' ? theme.isActive : ''}`} onMouseUp={this.handleSmallSizeChange}>
          {photoSizeSmall}  
        </button>  
        <button type="button" className={`${theme.resizerButton} ${size === 'L' ? theme.isActive : ''}`} onMouseUp={this.handleLargeSizeChange}>
          {photoSizeLarge}
        </button>
      </div>
    );

    const onImageLoad = onLoad.bind(null, store.getEditorState());

    return (
      <div className={theme.imageLayout}>
        <Popover
          visible={resizerVisible }
          content={resizerContent}
          placement={placement}
          overlayClassName={theme.imageResizer}
        >
          <div>      
            <div className={theme.imageWrapper} >
              <img
                {...elementProps}
                onClick={this.handleImageClick}
                onLoad={onImageLoad}
                src={src}
                role="presentation"
                className={combinedClassName}
                ref={el => this.imageEl = el}
              />
            </div>  
            {
              isFocused || comment ? ( 
                <Popover
                  content={content}
                  visible={visible}
                  placement="bottom"
                  trigger="click"
                  onVisibleChange={this.handleVisibleChange}
                  overlayClassName={theme.captionLayout}
                  align={{
                    points: ['tc', 'tc'],
                    offset: [0, 0],
                    targetOffset: [0, 0]
                  }}
                  transitionName=""
                >
                  <figcaption className={theme.imageCaption} onMouseUp={this.handleFigcaptionMouseUp}>
                    {comment || 'Add image comments'}
                  </figcaption>  
                </Popover> 
              ) : null
            }
          </div>
        </Popover>
      </div>
    );
  }
}