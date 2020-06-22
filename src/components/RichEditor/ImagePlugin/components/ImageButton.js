import React, {Component} from 'react';
import {Tooltip, Upload} from 'antd';
import classNames from 'classnames';
import {imageIcon} from '../../editorIcon';
import {token} from '../../../../common/setup';
import {addImage, updateImage} from '../modifiers/addImage';
import checkButtonStatus from '../../Buttons/disableStrategy';

export default class ImageButton extends Component {
  
  preventBubblingUp = e => {
    //e.preventDefault();  
  }

  handleWrapperMouseDown = e => {
    console.log('run handleWrapperMouseDown in ImageButton');
    if(this.props.toolbarMode === 'inline'){
      this.props.setForceVisible(true);    
    }  
  }

  handleWrapperMouseUp = e => {
    console.log('run handleWrapperMouseUp in ImageButton');
    if(this.props.toolbarMode === 'inline'){
      this.props.setForceVisible(false);  
    }
  }

  shouldButtonDisabled = () => {
    const editorState = this.props.getEditorState();
    return checkButtonStatus(editorState, 'IMAGE');    
  }

  render(){
    const {theme, getEditorState, setEditorState, toolbarMode} = this.props;
    const editorState = getEditorState();

    const uploadProps = {
      name: 'file',
      action: '//up.imgapi.com/',
      data: {
        Token: token,  
      },
      headers: {
        'X-Requested-With': null, 
      },
      onChange(info){
        console.log('file onchange');
        if(info.file.status === 'done'){ 
          console.log('file id after upload done: ', info.file.uid);
          console.log('info: ', info);
          setEditorState(updateImage(editorState, info.file.response.linkurl, info.file.uid, {
            width: info.file.response.width,
            height: info.file.response.height,  
          }));  
        } else if(info.file.status === 'error'){
          console.log('file error');
        }   
      },
      beforeUpload(file){
        const reader = new FileReader();
        reader.onload = e => {
          console.log('file uid beforeUpload: ', file.uid);
          setEditorState(addImage(editorState, e.target.result, file.uid, {}));                
        }
        reader.readAsDataURL(file);  
      },
      showUploadList: false,
    };

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
        onMouseDown={this.handleWrapperMouseDown}
        onMouseUp={this.handleWrapperMouseUp}
      >
        {this.shouldButtonDisabled() ? (
          <button
            className={theme.button}
            disabled
          >
            {imageIcon}
          </button>  
        ) : (
          <Upload {...uploadProps}>
            <Tooltip
              title="Insert Picture"
              align={align}
              overlayClassName={theme.tooltipOverlayer}
            >
              <button
                className={theme.button}
                //onMouseUp={this.handleBtnClick}
              >
                {imageIcon}
              </button>
            </Tooltip>  
          </Upload>  
        )}
      </div>  
    );
  }
}