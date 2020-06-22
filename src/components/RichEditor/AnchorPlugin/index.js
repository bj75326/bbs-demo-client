import decorateComponentWithProps from 'decorate-component-with-props';
import LinkButton from './components/LinkButton';
import DefaultLink from './components/Link';
import linkStyles from './index.less';
import linkStrategy, {matchesEntityType} from './linkStrategy';


export default (config = {}) => {
  const defaultTheme = linkStyles;

  const {theme = defaultTheme, placeholder, Link, linkTarget, extraProps} = config;

  const store = {
    getEditorState: undefined,
    seteditorState: undefined,  
  };

  return {
    initialize: ({getEditorState, setEditorState}) => {
      store.getEditorState = getEditorState;  
      store.setEditorState = setEditorState;
    },

    decorators: [
      {
        strategy: linkStrategy,
        matchesEntityType,
        component: Link || decorateComponentWithProps(DefaultLink, {
          target: linkTarget,
          //Link的渲染组件中需要复用LinkButton组件
          store,
          ownTheme: theme,
          ...extraProps
        }),
      }
    ],

    LinkButton: decorateComponentWithProps(LinkButton, {
      store,
      ownTheme: theme,
      ...extraProps
    }),
  };
};