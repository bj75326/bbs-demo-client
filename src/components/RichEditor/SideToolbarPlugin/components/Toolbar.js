import React, {Component} from 'react';
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';
import BlockTypeSelect from './BlockTypeSelect';
import CodeBlockButton from '../../Buttons/CodeBlockButton';
import OrderedListButton from '../../Buttons/OrderedListButton';
import UnorderedListButton from '../../Buttons/UnorderedListButton';

export default class Toolbar extends Component {
  constructor(props){
    super(props);
    this.state = {
      position: undefined,
      visible: false,
      forceVisible: false,
      popupVisible: false,
    };
  }

  static defaultProps = {
    children: externalProps => (
      <div>
        <CodeBlockButton {...externalProps}/>
        <OrderedListButton {...externalProps}/>
        <UnorderedListButton {...externalProps}/>  
      </div>
    ),  
  };

  componentDidMount(){
    this.props.store.subscribeToItem('editorState', this.onEditorStateChange);  
  }

  componentWillUnmount(){
    this.props.store.unsubscribeFromItem('editorState', this.onEditorStateChange);  
  }

  setForceVisible = (forceVisible) => {
    this.setState({ 
      forceVisible,
    });
  }

  setPopupVisible = (popupVisible) => {
    this.setState({
      popupVisible,
    });
  }

  onEditorStateChange = editorState => {
    setTimeout(()=>{
      console.log('refresh sidetoolbar');
      
      const selection = editorState.getSelection();
      const {forceVisible} = this.state;
      const {forceInvisible} = this.props;

      console.log('selection.getHasFocus(): ', selection.getHasFocus());
      if(forceInvisible){
        return;  
      }

      if(!forceVisible && !selection.getHasFocus()){
        this.setState({
          visible: false  
        });
        return;  
      } 
      const currentContent = editorState.getCurrentContent();
      const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
      if(!forceVisible && (currentBlock.getType() !== 'unstyled' || currentBlock.getLength() > 0)){
        this.setState({
          visible: false 
        });  
        return;
      }
          
      const offsetKey = DraftOffsetKey.encode(currentBlock.getKey(), 0, 0);
    
      const node = document.querySelectorAll(
        `[data-offset-key="${offsetKey}"]`  
      )[0];
      console.log('node ', node);
      console.log('node.offsetTop', node.offsetTop);
      const editorRef = this.props.store.getItem('getEditorRef')();
      if(!editorRef) return;
      let editorRoot = 
        editorRef.refs && editorRef.refs.editor
          ? editorRef.refs.editor 
          : editorRef.editor;
      while(editorRoot.className.indexOf('DraftEditor-root') === -1){
        editorRoot = editorRoot.parentNode;  
      }  

      const position = {
        top: node.offsetTop - 5,
        left: editorRoot.offsetLeft - 50,
      };
      console.log('position: ', position);

      let prevLeft = undefined;
      let prevTop = undefined;

      if(this.state.position){
        prevLeft = this.state.position.left;
        prevTop = this.state.position.top;
      }

      if(prevLeft !== position.left || prevTop !== position.top){
        this.setState({
          position,
          popupVisible: false,    
        });  
      }

      if(!this.state.visible){
        this.setState({
          visible: true,
          popupVisible: false,
        });  
      }
      
    });
  }

  render(){
    const {theme, store, getEditorState, children} = this.props;

    const {position, visible, popupVisible} = this.state;

    const style = {
      ...position  
    }

    if(!visible) style.display = "none"; 
    
    return (
      <div className={theme.toolbarStyles.wrapper} style={style}>
        <BlockTypeSelect
          theme={theme}
          getEditorState={getEditorState}
          setEditorState={store.getItem('setEditorState')}
          setForceVisible={this.setForceVisible}
          visible={popupVisible}
          setPopupVisible={this.setPopupVisible}
        >
          {children}
        </BlockTypeSelect>  
      </div>  
    );
  }
}