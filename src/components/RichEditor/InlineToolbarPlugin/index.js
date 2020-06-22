import React from 'react';
import createStore from './utils/createStore';
import Toolbar from './components/Toolbar';
import Separator from './components/Separator';

export default (config = {}) => {
  const store = createStore();
  
  const {theme = {}} = config;

  const InlineToolbar = props => (
    <Toolbar {...props} store={store} theme={theme}/>
  );

  return {
    initialize: ({setEditorState, getEditorRef }) => {
      //store.updateItem('getEditorState', getEditorState);
      store.updateItem('setEditorState', setEditorState);
      store.updateItem('getEditorRef', getEditorRef);
    },  

    onChange: editorState => {
      store.updateItem('selection', editorState.getSelection());
      return editorState;  
    },

    Toolbar: InlineToolbar,
  };
};

export {Separator};