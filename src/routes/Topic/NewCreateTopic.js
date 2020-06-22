import React, {Component} from 'react';
import {connect} from 'dva';
import {Input, Tooltip} from 'antd';
import Drawer from 'rc-drawer';
import styles from './NewCreateTopic.less';
import RichEditor from '../../components/RichEditor';
import StaticToolbar, {toolbarPlugin} from '../../components/RichEditor/StaticToolbar';
import InlineToolbar, {inlineToolbarPlugin} from '../../components/RichEditor/InlineToolbar';
import SideToolbar, {sideToolbarPlugin} from '../../components/RichEditor/SideToolbar';
import RichEditorPlugins from '../../components/RichEditor/RichEditorPlugins';
import {composeDecorators} from 'draft-js-plugins-editor';
import decorateComponentWithProps from 'decorate-component-with-props';
import {EditorState, convertFromRaw, convertToRaw} from 'draft-js';
import {is} from 'immutable';

const {
  createImagePlugin,
  createImageLoadingPlugin,
  createFocusPlugin,
  createLinkPlugin,
  createDividerPlugin,
  createMathJaxPlugin,
  createUndoPlugin
} = RichEditorPlugins;

const {TextArea} = Input;

let linkPlugin = null;
let imagePlugin = null;

const focusPlugin = createFocusPlugin();

const decorator = composeDecorators(
  focusPlugin.decorator
);

const imageLoadingPlugin = createImageLoadingPlugin({
  decorator
});

const dividerPlugin = createDividerPlugin({
  decorator
});

const mathJaxPlugin = createMathJaxPlugin({
  decorator,
  //MathJax渲染公式时获取的node位置数据是不准确的，需要在公式完全渲染好后重新refresh sideToolbar （如果有需要的话）
  onRender: sideToolbarPlugin.onChange,
});

const undoPlugin = createUndoPlugin();

@connect(({topic}) => ({
  topicId: topic.topicId,
  topicTitle: topic.topicTitle,
  topicContent: topic.topicContent,
  toolbarMode: topic.toolbarMode,
  format: topic.format,
  status: topic.status,
}))
export default class CreateTopic extends Component {
  constructor(props){
    super(props);

    this.forceSync = false;
    //this.initContent = false;

    this.state = {
      readOnly: false,
      editorState: props.topicContent ? EditorState.createWithContent(convertFromRaw(props.topicContent)) : EditorState.createEmpty(),
      //topic: props.topicTitle,
      //mode: props.toolbarMode,
      //format: props.format,
      
      //inline toolbar 在editor onFocus时会根据之前的selection状态渲染一次 这是不需要的
      forceInvisible: false,
    };
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.status === 'init' && !this.props.status){
      //this.initContent = true; 
      if(nextProps.topicContent){
        this.setState({
          editorState:  EditorState.createWithContent(convertFromRaw(nextProps.topicContent))
        });  
      }
    }
      
  }

  componentDidUpdate(){
    console.log('NewCreateTopic componentDidUpdate');
    this.forceSync = false;
  }

  getEditorState = () => {
    return this.state.editorState;
  }

  toggleStaticMode = e => {
    const checked = e.currentTarget.dataset.checked;
    if(checked === 'false'){
      this.changeMode('static');    
    }
  }

  toggleInlineMode = e => {
    const checked = e.currentTarget.dataset.checked;
    if(checked === 'false'){
      this.changeMode('inline');  
    }
  }
  
  changeMode = (mode) => {
    this.props.dispatch({
      type: 'topic/syncTopic',
      payload: {
        topicId: this.props.topicId,
        toolbarMode: mode
      }
    });
  }

  toggleIndentFormat = e => {
    const checked = e.currentTarget.dataset.checked;
    if(checked === 'false'){
      this.changeFormat('indent');  
    }  
  }

  toggleSpacingFormat = e => {
    const checked = e.currentTarget.dataset.checked;
    if(checked === 'false'){
      this.changeFormat('spacing');    
    }
  }

  changeFormat = format => {
    this.props.dispatch({
      type:'topic/syncTopic',
      payload: {
        topicId: this.props.topicId,
        format
      }
    });  
  }

  handleEditorStateChange = editorState => {
    const contentState = editorState.getCurrentContent();
    const currentContent = this.state.editorState.getCurrentContent();
    console.log ('immutable check: ', is(contentState, currentContent));
    console.log ('this.forceSync: ', this.forceSync);
    this.setState({
      editorState: editorState,
    });
  }

  lockOrUnlockEditor = readOnly => {
    this.setState({
      readOnly: readOnly,
    });  
  }

  setForceInvisible = forceInvisible => {
    this.setState({
      forceInvisible
    });
  }

  getSideToolbarVisibleValue = () => {
    return this.sideToolbarInstance.toolbarInstance.state.visible;
  }

  render(){
    const {readOnly, editorState, forceInvisible} = this.state;
    const {drawerVisible, onDrawerClose, drawerClassName, toolbarMode, format} = this.props;

    const superProps = {
      editor: this,  
    };

    if(!imagePlugin){
      imagePlugin = createImagePlugin({
        imageComponent: decorateComponentWithProps(imageLoadingPlugin.ImageComponent, {
          ...superProps,
          onLoad: sideToolbarPlugin.onChange,
        }), 
        decorator 
      });  
    }

    if(!linkPlugin){
      linkPlugin = createLinkPlugin({
        extraProps: superProps,
      });  
    }

    const plugins = [focusPlugin, imagePlugin, imageLoadingPlugin, toolbarPlugin, linkPlugin, dividerPlugin, mathJaxPlugin, inlineToolbarPlugin, sideToolbarPlugin];


    return (
      <div className={styles.container}>
        {toolbarMode === 'static' ? (
          <StaticToolbar 
            getEditorState={this.getEditorState}
            LinkButton={linkPlugin.LinkButton}
            ImageButton={imageLoadingPlugin.ImageButton}
            DividerButton={dividerPlugin.DividerButton}
            MathJaxButton={mathJaxPlugin.TeXButton}
            UndoButton={undoPlugin.UndoButton}
            RedoButton={undoPlugin.RedoButton}
          />  
        ) : [
          <InlineToolbar
            key="inline"
            getEditorState={this.getEditorState}
            LinkButton={linkPlugin.LinkButton}
            MathJaxButton={mathJaxPlugin.TeXButton}
            forceInvisible={forceInvisible}  
          />,
          <SideToolbar
            key="side"
            getEditorState={this.getEditorState}
            ImageButton={imageLoadingPlugin.ImageButton}
            MathJaxButton={mathJaxPlugin.TeXButton}
            DividerButton={dividerPlugin.DividerButton}
            forceInvisible={forceInvisible}
            ref={(instance) => {this.sideToolbarInstance = instance}}
          />
        ]}
        <h1 className={styles.titleWrapper}>
          <TextArea className={styles.title} placeholder="Title" rows="1"/>
        </h1>
        <RichEditor
          plugins={plugins}
          editorState={editorState}
          readOnly={readOnly}
          onChange={this.handleEditorStateChange}  
          toolbarMode={toolbarMode} 
          forceInvisible={forceInvisible}
          setForceInvisible={this.setForceInvisible}
          getSideToolbarVisibleValue={this.getSideToolbarVisibleValue}
          refreshSideToolbar={sideToolbarPlugin.onChange}
          refreshInlineToolbar={inlineToolbarPlugin.onChange}
          ref={(instance)=>{this.richEditor = instance}}
        />
        <Drawer
          className={drawerClassName}
          placement="right"
          showMask={false}
          handler={false}
          open={drawerVisible}
          onClose={onDrawerClose}
          getContainer={false}
          width="300px"
        >
          <div className={styles.drawerContainer}>
            <section className={styles.section}>
              <h3>Tools</h3>
              <div>
                <a className={styles.toolBtn}>
                  <i className="iconfont icon-number"></i>
                  <span>Counter</span>
                </a>
                <a className={styles.toolBtn}>
                  <i className="iconfont icon-pre-view"></i>
                  <span>Preview</span>
                </a>      
              </div>  
            </section>
            <section className={styles.section}>
              <h3>Toolbar mode(开发中...)</h3>
              <div>
                <a className={`${styles.modeBtn} ${styles.staticModeBtn}`} data-checked={toolbarMode === 'static'} onClick={this.toggleStaticMode}>
                  <i></i>
                  <label>Static toolbar</label>
                  <div className={styles.guideTooltip}>Full display of all typesetting tools, suitable for long text editing</div>
                </a>
                <a className={`${styles.modeBtn} ${styles.inlineModeBtn}`} data-checked={toolbarMode === 'inline'} onClick={this.toggleInlineMode}>
                  <i></i>
                  <label>Inline toolbar</label>
                  <div className={styles.guideTooltip}>Typesetting tools show as tooltip, keep interface simple</div>
                </a>
              </div>
            </section>
            <section className={styles.section}>
              <h3>Format</h3>   
              <div>
                <a className={`${styles.modeBtn} ${styles.indentBtn}`} data-checked={format === 'indent'} onClick={this.toggleIndentFormat}>
                  <i></i>
                  <label>Indent</label>
                  <div className={styles.guideTooltip}>Indent at the beginning of a paragraph, classic style</div>
                </a>
                <a className={`${styles.modeBtn} ${styles.spacingBtn}`} data-checked={format === 'spacing'} onClick={this.toggleSpacingFormat}>
                  <i></i>
                  <label>Spacing</label>
                  <div className={styles.guideTooltip}>Spacing between paragraphs, clean and tidy</div>
                </a>
              </div> 
            </section>
          </div>
        </Drawer>  
      </div>  
    );
  }
}