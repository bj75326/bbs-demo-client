import React, {Component} from 'react';
import classNames from 'classnames';
import {Tooltip, Modal, Input, Form, Button, Row, Col} from 'antd';
import {textIcon, linkIcon} from '../../editorIcon';
import {prefix} from '../../../../common/setup';
import checkButtonStatus from '../../Buttons/disableStrategy';
import {getOffsetWithEntityKey, getTextWithEntityKey} from '../../util';

import {convertToRaw, RichUtils, EditorState, Modifier} from 'draft-js';

const urlMatchRegExp = /^(((ht|f)tps?):\/\/)?[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/;
const noop = ()=>{};

const FormItem = Form.Item;

const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

const getSelectionText = editorState => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const startKey = selection.getStartKey();
  const endKey = selection.getEndKey();
  const startOffset = selection.getStartOffset();
  const endOffset = selection.getEndOffset();
  if(startKey !== endKey) return '';
  return contentState.getBlockForKey(startKey).getText().slice(startOffset, endOffset);
};

@Form.create()
class LinkButton extends Component {

  constructor(props){
    super(props);
    this.state = {
      visible: false,
      initLinkText: '',
      initLinkUrl: '',
    };
  }

  componentDidUpdate(_, prevState){
    if(!prevState.visible && this.state.visible ){
      setTimeout(() => {this.urlInput.focus()}, 0);   
    }  
  }

  preventBubblingUp = e => {
    e.preventDefault();
  }

  handleBtnClick = e => {
    const editorState = this.props.getEditorState();
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const startOffset = selection.getStartOffset();
    const endOffset = selection.getEndOffset();
    const currentBlock = contentState.getBlockForKey(selection.getStartKey());

    const startEntityKey = currentBlock.getEntityAt(startOffset);
    const endEntityKey = currentBlock.getEntityAt(endOffset);
    
    if(startEntityKey && startEntityKey === endEntityKey){
      this.tryToUpdateLink = true;
      const linkUrl = contentState.getEntity(startEntityKey).get('data').linkUrl;
      const linkText = getTextWithEntityKey(currentBlock, startEntityKey);
      this.setState({
        visible: true,
        initLinkText: linkText,
        initLinkUrl: linkUrl,
      });
    }else {
      this.tryToUpdateLink = false;
      const linkText = getSelectionText(editorState);

      this.setState({
        visible: true,
        initLinkText: linkText,
        initLinkUrl: '',
      });   
    }

  }

  createLink = e => {
    const {getEditorState, setEditorState, form} = this.props;
    const {getFieldValue} = form;
    const linkText = getFieldValue('text');
    const linkUrl = getFieldValue('url');
    
    const editorState = getEditorState();
    const contentState = editorState.getCurrentContent().createEntity('LINK', 'MUTABLE', {
      linkUrl,
      visible: true,
      modalVisible: false,
    });
    const entityKey = contentState.getLastCreatedEntityKey();
    
    const selection = editorState.getSelection();
    
    let newContentState;

    if(!selection.isCollapsed()){
      newContentState = Modifier.replaceText(
        contentState, 
        selection,
        (linkText || linkUrl),
        undefined,
        entityKey
      );
    }else{
      newContentState = Modifier.insertText(
        contentState,
        selection,
        (linkText || linkUrl),
        undefined,
        entityKey
      );
    }

    const withLink = EditorState.push(editorState, newContentState);

    const newOffset = selection.getStartOffset() + (linkText ? linkText.length : linkUrl.length);
    const newSelection = selection.merge({
      anchorOffset: newOffset,
      focusOffset: newOffset,
    });
    setEditorState(EditorState.forceSelection(withLink, newSelection));
    
    this.setState({
      visible: false,
    });    
  }

  updateLink = e => {
    const {getEditorState, setEditorState, form} = this.props; 
    const {getFieldValue} = form;   
    const linkText = getFieldValue('text');
    const linkUrl = getFieldValue('url');

    const editorState = getEditorState();
    const selection = editorState.getSelection();
    const startKey = selection.getStartKey();
    const currentBlock = editorState.getCurrentContent().getBlockForKey(startKey);
    const entityKey = currentBlock.getEntityAt(selection.getStartOffset());
    const offset = getOffsetWithEntityKey(currentBlock, entityKey);
    let contentState = editorState.getCurrentContent().mergeEntityData(entityKey, {
      linkUrl,
      visible: true,
      modalVisible: false,
    });
    contentState = Modifier.replaceText(
      contentState,
      selection.merge({
        anchorOffset: offset[0],
        focusOffset: offset[1],
        isBackward: false,    
      }),
      linkText || linkUrl,
      undefined,
      entityKey,
    );

    const newOffset = offset[0] + (linkText ? linkText.length : linkUrl.length);
    const newSelection = selection.merge({
      anchorOffset: newOffset,
      focusOffset: newOffset,
    });

    const withUpdatedLink = EditorState.push(editorState, contentState);

    setEditorState(EditorState.forceSelection(withUpdatedLink, newSelection));

    this.setState({
      visible: false,
    });
  }  

  handleSubmit = e => {
    e.preventDefault();
    if(this.tryToUpdateLink){
      this.updateLink(e);
    }else {
      this.createLink(e);
    }  
    if(this.props.toolbarMode === 'inline'){
      this.props.setForceVisible(false);
    }
  }

  handleCancel = e => {
    if(this.props.toolbarMode === 'inline'){
      this.props.setForceVisible(false);
    }
    this.setState({
      visible: false,
    });
  }

  handleBtnMouseDown = e => {
    if(this.props.toolbarMode === 'inline'){
      this.props.setForceVisible(true);  
    }
  }

  shouldButtonDisabled = () => {
    const editorState = this.props.getEditorState();
    return checkButtonStatus(editorState, 'ANCHOR');     
  }

  shouldConfirmBtnDisabled = () => {
    const {getFieldsError, getFieldValue} = this.props.form;
    const url = getFieldValue('url');  
    if(!url) return true;
    if(hasErrors(getFieldsError())){
      return true;
    }
    return false;
  }

  render(){
    const {ownTheme, theme=ownTheme, form, toolbarMode} = this.props;
    const {getFieldDecorator} = form;
    const {visible, initLinkText, initLinkUrl} = this.state;
    
    const className= classNames(theme.button);
    const disableButton = this.shouldButtonDisabled();

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
        //onMouseDown={!disableButton ? this.preventBubblingUp : noop}
      >
        {disableButton ? (
          <button
            className={className}
            type="button"
            disabled
          >
            {linkIcon}     
          </button>  
        ) : (
          
          <Tooltip
            placement="bottom"
            title="Hyperlink (⌘k)"  
            align={align}
            overlayClassName={theme.tooltipOverlayer}
          >
          
            <button
              className={className}
              onMouseDown={this.handleBtnMouseDown}
              onMouseUp={this.handleBtnClick}
              type="button"
            >
              {linkIcon}     
            </button>  
          </Tooltip>  
        )}
        <Modal
          title="Insert Link"  
          visible={visible}   
          footer={null}
          width={400}
          destroyOnClose
          onCancel={this.handleCancel}   
          wrapClassName={ownTheme.linkModalWrapper}
          maskClosable={false}
          maskStyle={{
            zIndex: 1031,
          }}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem help={null}>
              {getFieldDecorator('text', {
                initialValue: initLinkText,
              })(
                <Input
                  className={`${prefix}-input-affix-wrapper`}
                  prefix={textIcon} 
                  placeholder="Link text"
                  autoComplete="off"
                />  
              )}  
            </FormItem>
            <FormItem help={null}>
              {getFieldDecorator('url', {
                initialValue: initLinkUrl,
                rules: [
                  {required: true}, 
                  {
                    validator(rule, value, callback){
                      const errors = [];
                      if(!urlMatchRegExp.test(value)){
                        errors.push(new Error("url format error"));  
                      } 
                      callback(errors);       
                    }
                  }
                ]
              })(
                <Input
                  className={`${prefix}-input-affix-wrapper`}
                  prefix={linkIcon}
                  placeholder="Link url"
                  autoComplete="off"
                  ref={el => this.urlInput = el}
                />
              )}
            </FormItem>
            <FormItem>
              <Row gutter={24}>
                <Col span={12}>
                  <Button className={`${prefix}-btn`} onClick={this.handleCancel}>Cancel</Button>     
                </Col>
                <Col span={12}>
                  <Button className={`${prefix}-btn`} type="primary" htmlType="submit" disabled={this.shouldConfirmBtnDisabled()}>Confirmed</Button>
                </Col>  
              </Row>    
            </FormItem>
          </Form>         
        </Modal>  
      </div>  
    );
  }
}

export default LinkButton;