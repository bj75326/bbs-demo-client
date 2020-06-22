import React, {Component} from 'react';
import classNames from 'classnames';

export default class ImageLoading extends Component {
      
  render(){
    const {
      block,
      className,
      theme = {},
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
      ...elementProps    
    } = otherProps;

    const {isFocused} = blockProps;

    const combinedClassName = classNames(
      theme.imageLoading, 
      className,
    );
    
    const uploaderLayout = classNames(
      theme.uploaderLayout,
      {
        [theme.imageLoadingFocused]: isFocused,
        [theme.imageLoadingUnfocused]: !isFocused, 
      }     
    );

    const {src} = contentState.getEntity(block.getEntityAt(0)).getData();

    return (
      <div className={theme.imageUploader}>
        <div className={uploaderLayout}>
          <img {...elementProps} src={src} alt="picture" className={combinedClassName}/>
          <div className={theme.uploaderStatus}>
            <div className={theme.uploaderText}>Uploading...</div>      
          </div>
          <div className={theme.uploaderProgress}>
            <div className={theme.loadingBar}></div>  
          </div>    
        </div>  
      </div>  
    );
  }
};