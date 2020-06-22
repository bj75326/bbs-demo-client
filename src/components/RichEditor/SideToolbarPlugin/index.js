import React from 'react';
import createStore from './utils/createStore';
import Toolbar from './components/Toolbar';

export default (config = {}) => {
  const store = createStore();

  const {theme = {}} = config;

  const SideToolbar = props => {
    
    const {refProp, ...otherProps} = props;
    return (
      <Toolbar {...otherProps} ref={refProp} store={store} theme={theme}/>
    );
  };

  return {
    initialize: ({setEditorState, getEditorRef}) => {
      store.updateItem('setEditorState', setEditorState);
      store.updateItem('getEditorRef', getEditorRef);  
    },

    onChange: editorState => {
      store.updateItem('editorState', editorState);
      return editorState;  
    },

    Toolbar: SideToolbar,
  };
};