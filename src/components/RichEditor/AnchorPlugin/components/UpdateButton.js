import React, {Component} from 'react';
import {Modal, Input, Form, Button, Row, Col} from 'antd'; 
import {textIcon, editIcon, linkIcon} from '../../editorIcon';
import {prefix} from '../../../../common/setup';
import {EditorState, Modifier} from 'draft-js';
import {getOffsetWithEntityKey} from '../../util';

const FormItem = Form.Item;

const urlMatchRegExp = /^(((ht|f)tps?):\/\/)?[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/;

const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

@Form.create()
class UpdateButton extends Component {

  handleBtnClick = e => {
    const {store: {getEditorState, setEditorState}, entityKey, editor} = this.props;
    const editorState = getEditorState();
    editorState.getCurrentContent().mergeEntityData(entityKey, {
      modalVisible: true  
    });
    setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()));

    editor.lockOrUnlockEditor(true);
  }

  handleCancel = e => {
    const {store: {getEditorState, setEditorState}, entityKey, editor} = this.props;
    const editorState = getEditorState();
    editorState.getCurrentContent().mergeEntityData(entityKey, {
      modalVisible: false
    });
    setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()));  
    editor.lockOrUnlockEditor(false);
  }

  handleSubmit = e => {
    e.preventDefault();
    const {store: {getEditorState, setEditorState}, form, entityKey, blockKey, editor} = this.props;
    const {getFieldValue} = form;
    const linkText = getFieldValue('text');
    const linkUrl = getFieldValue('url');
    const editorState = getEditorState();
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    const offset = getOffsetWithEntityKey(contentState.getBlockForKey(blockKey), entityKey);

    let newContentState = contentState.mergeEntityData(entityKey, {
      linkUrl,
      visible: true,
      modalVisible: false,
    });
    newContentState = Modifier.replaceText(
      newContentState,
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

    const withUpdatedLink = EditorState.push(editorState, newContentState);
    setEditorState(EditorState.forceSelection(withUpdatedLink, newSelection));

    editor.lockOrUnlockEditor(false);
  }

  componentDidUpdate(prevProps){
    if(!prevProps.visible && this.props.visible){
      setTimeout(() => {this.urlInput.focus()}, 0);  
    }    
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
    const {ownTheme, form, visible, linkUrl, linkText} = this.props;
    const {getFieldDecorator} = form; 
    
    return (
      <div
        className={ownTheme.buttonWrapper} 
      >
        <button
          className={ownTheme.button}
          type="button"
          onMouseUp={this.handleBtnClick}
        >
          {editIcon}
        </button> 
        <Modal
          title="Update Link"
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
                initialValue: linkText,
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
                initialValue: linkUrl,
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

export default UpdateButton;