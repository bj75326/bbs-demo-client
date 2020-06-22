import loadMathJax from './mathjax/loadMathJax';
import TeXButton from './components/TeXButton';
import decorateComponentWithProps from 'decorate-component-with-props';
import styles from './index.less';
import TeXBlock from './components/TeXBlock';
import inlineTeXStrategy from './InlineTeXStrategy';
import InlineTeX from './components/InlineTeX';

const defaultConfig = {
  theme: styles,  
};

const createMathJaxPlugin = (config={}) => {
  const {
    macros,
    completion,
    script,
    mathjaxConfig,
    theme,
    decorator,
    TeXBlockComponent,
    InlineTeXComponent,
    onRender,
    extraProps
  } = Object.assign(defaultConfig, config);

  loadMathJax({macros, script, mathjaxConfig});

  let TeXBlockRenderer = TeXBlockComponent || TeXBlock;
  let InlineTeXRender = InlineTeXComponent || InlineTeX;
  if(decorator){
    TeXBlockRenderer = decorator(TeXBlockRenderer);  
    //InlineTeXRender = decorator(InlineTeXRender);
  }

  const store = {
    getEditorState: undefined,
    setEditorState: undefined,
    getReadOnly: undefined,
    setReadOnly: undefined,
    getEditorRef: undefined,
    teXToUpdate: {},
  };

  const ThemedTeXBlock = decorateComponentWithProps(TeXBlockRenderer, {theme, store, onRender});
  const ThemedInlineTeX = decorateComponentWithProps(InlineTeXRender, {theme, store});

  const blockRendererFn = (block, {getEditorState}) => {
    if(block.getType() === 'atomic'){
      const contentState = getEditorState().getCurrentContent();
      const entityKey = block.getEntityAt(0);
      if(!entityKey) return null;
      const entity = contentState.getEntity(entityKey);
      const type = entity.getType();
      console.log("我们在blockRendererFn，type", type);
      if(type === 'MATHJAX' || type === 'MathJax'){
        return {
          component: ThemedTeXBlock,
          editable: false,
        };  
      } 
      /*
      const type = block.getData().get('type');
      if(type === 'MATHJAX' || type === 'MathJax'){
        return {
          component: ThemedTeXBlock,
          editable: false,  
        };
      }
      */
    } 
    return null; 
  }

  return {
    initialize: ({getEditorState, setEditorState, getReadOnly, setReadOnly, getEditorRef}) => {
      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
      store.getReadOnly = getReadOnly;
      store.setReadOnly = setReadOnly;
      store.getEditorRef = getEditorRef;  
    },
    blockRendererFn,
    decorators: [
      {
        strategy: inlineTeXStrategy,
        component: ThemedInlineTeX,
      }
    ],

    TeXButton: decorateComponentWithProps(TeXButton, {
      ownTheme: theme,
      store,
      ...extraProps
    }),
  };
};

export default createMathJaxPlugin;