import React from 'react';
import BoldButton from '../../Buttons/BoldButton';
import ItalicButton from '../../Buttons/ItalicButton';
import HeaderButton from '../../Buttons/HeaderButton';
import PropTypes from 'prop-types';


class Toolbar extends React.Component {

  state = {
    overrideContent: undefined
  }

  /*
  forceRender = () => this.forceUpdate();
  
  componentWillMount() {
    this.props.store.subscribeToItem('selection', this.forceRender);
  }

  componentWillUnmount() {
    this.props.store.unsubscribeFromItem('selection', this.forceRender);
  }
  */

  onOverrideContent = (overrideContent) => this.setState({ overrideContent });

  renderDefaultButtons = (externalProps) => (
    <div>
      <ItalicButton {...externalProps} />
      <BoldButton {...externalProps} />
      <HeaderButton {...externalProps} />
    </div>
  );

  render() {
    const { theme, store } = this.props;
    const { overrideContent: OverrideContent } = this.state;
    const childrenProps = {
      theme: theme.buttonStyles,
      //draft-js-plugin-editor bug 导致store获取的getEditorState不能获取最新的editorState
      //getEditorState: store.getItem('getEditorState'),
      getEditorState: this.props.getEditorState,
      setEditorState: store.getItem('setEditorState'),
      onOverrideContent: this.onOverrideContent
    };
    
    return (
      <div
        className={theme.toolbarStyles.toolbar}
      >
        {OverrideContent
          ? <OverrideContent {...childrenProps} />
          : (this.props.children || this.renderDefaultButtons)(childrenProps)}
      </div>
    );
  }
}

Toolbar.propTypes = {
  children: PropTypes.func
};

export default Toolbar;