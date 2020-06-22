import React, {Component} from 'react';
import {Tooltip, Modal} from 'antd';
import checkButtonStatus from '../../Buttons/disableStrategy';
import {mathJaxIcon} from '../../editorIcon';
import FormulaEditor from './FormulaEditor';
import {insertTeXBlock} from '../modifiers/insertTeX';
import {Modifier, EditorState} from 'draft-js';
import {isAtEndOfBlock} from '../../util';

class TeXButton extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      inputValue: '',
      showAsBlock: props.showMode !== 'tooltip',
    };  
  }

  shouldButtonDisabled = () => {
    const editorState = this.props.getEditorState();
    return checkButtonStatus(editorState, 'MATHJAX');  
  }

  preventBubblingUp = e => {
    //e.preventDefault();
  }

  handleBtnMouseDown = () => {
    if(this.props.toolbarMode === 'inline'){
      this.props.setForceVisible(true);  
    }  
  }

  handleBtnMouseUp = e => {
    this.setState({
      visible: true,
    });  
    if(this.props.toolbarMode === 'inline'){
      this.props.setForceVisible(false);  
    }
  }

  handleInputChange = value => {
    this.setState({
      inputValue: value,
    });    
  }

  handleCancel = () => {
    this.setState({
      inputValue: '',
      visible: false,  
    });   
  }

  bkcomponentDidUpdate(){
    console.log('run TeXButton componentDidUpdate!!');
    if(this.state.needDigest){
      
      const {getEditorState, setEditorState, store} = this.props; 
      const editorState = getEditorState();
      const {inputValue, showAsBlock} = this.state;
      //console.log('inputValue: ', inputValue);
      //setEditorState(insertTeXBlock(editorState, inputValue));
      store.getEditorRef().blur();
      store.getEditorRef().focus();
      this.setState({
        needDigest: false,
        
      });
    }  
  }

  bkhandleConfirm = () => {
    const {getEditorState, setEditorState, store} = this.props; 
    const editorState = getEditorState();
    const {inputValue, showAsBlock} = this.state;
    
    this.setState({
      inputValue: '',
      visible: false,
      needDigest: true,
    }, () => {
      setEditorState(insertTeXBlock(editorState, inputValue));  
    });

    /*
    setTimeout(() => {
      console.log('setTimeout editor focus!!!');
      store.getEditorRef().blur();
      store.getEditorRef().focus(); 
      
      setTimeout(() => {
        console.log('current active: ', document.activeElement);
        setEditorState(insertTeXBlock(editorState, inputValue));  
      }, 0);
    }, 0);
    */
  }
  
  handleConfirm = () => {
    const {getEditorState, setEditorState} = this.props; 
    const editorState = getEditorState();
    const {inputValue, showAsBlock} = this.state;

    if(showAsBlock){
      setEditorState(insertTeXBlock(editorState, inputValue));
    }else{
      let contentState = editorState.getCurrentContent();
      let selection = editorState.getSelection();
      //let teX = '';
      if(!selection.isCollapsed()){
        /*
        const blockKey = selection.getStartKey();
        if(blockKey === selection.getEndKey()){
          teX = contentState.getBlockForKey(blockKey)
            .getText()
            .slice(
              selection.getStartOffset(),
              selection.getEndOffset()
            );
        }
        */
        console.log('removeRange run');
        contentState = Modifier.removeRange(
          contentState,
          selection,
          'backward',
        ); 
        selection = contentState.getSelectionAfter();       
      }

      contentState = contentState.createEntity(
        'INLINETEX',
        'IMMUTABLE',
        {
          inputTeX: inputValue
        }    
      );
      const newEntityKey = contentState.getLastCreatedEntityKey();

      const atBeginOfBlock = selection.getStartOffset() === 0
      const atEndOfBlock = isAtEndOfBlock(contentState, selection);

      if(atBeginOfBlock){
        contentState = Modifier.insertText(
          contentState,
          selection,
          ' ',
        );
        selection = contentState.getSelectionAfter();  
      }

      contentState = Modifier.insertText(
        contentState,
        selection,
        '\t\t',
        undefined,
        newEntityKey
      );
      selection = contentState.getSelectionAfter();
      
      if(atEndOfBlock){
        contentState = Modifier.insertText(
          contentState,
          selection,
          ' '
        );  
      }
      setEditorState(EditorState.push(editorState, contentState, 'apply-entity'));
    }

    this.handleCancel();
  }
  

  handleSwitchCheck = () => {
    this.setState({
      showAsBlock: !this.state.showAsBlock,
    });
  }

  render(){
    const {visible, inputValue, showAsBlock} = this.state;
    const {ownTheme, theme=ownTheme, toolbarMode} = this.props;
    
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
        //onMouseDown={this.preventBubblingUp}
      >
        {disableButton ? (
          <button
            className={theme.button}
            type="button"
            disabled={true}
          >
            {mathJaxIcon}  
          </button>  
        ) : (
          <Tooltip
            placement="bottom"
            title="Insert Formula (⌘⇧E)"
            align={align}
            overlayClassName={theme.tooltipOverlayer}
          > 
            <button
              className={theme.button}
              onMouseDown={this.handleBtnMouseDown}
              onMouseUp={this.handleBtnMouseUp}
              type="button"
            >
              {mathJaxIcon}    
            </button>
          </Tooltip>  
        )}
        <Modal
          title="Insert Formula"
          visible={visible}
          footer={null}
          width={550}
          destroyOnClose
          wrapClassName={ownTheme.mathJaxModalWrapper}
          maskClosable={false}
          onCancel={this.handleCancel}
          maskStyle={{
            zIndex: 1031,
          }}  
        >
          <FormulaEditor
            showBlockSwitch
            showAsBlock={showAsBlock}
            onSwitchChange={this.handleSwitchCheck}
            value={inputValue}
            onChange={this.handleInputChange}
            onCancel={this.handleCancel}
            onConfirm={this.handleConfirm}
          />    
        </Modal>
      </div>
        
    );
  }
}

export default TeXButton;