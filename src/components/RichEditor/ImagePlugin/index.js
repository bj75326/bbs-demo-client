import ImageButton from './components/ImageButton';
import ImageLoading from './components/ImageLoading';
import ImageComponent from './components/Image';
import imageStyles from './index.less';
import decorateComponentWithProps from 'decorate-component-with-props';


export default (config={}) => {
  const theme = config.theme || imageStyles;

  let ImageLoadingComponent = config.ImageLoading || ImageLoading;
  if(config.decorator){
    ImageLoadingComponent = config.decorator(ImageLoadingComponent);  
  }

  const ThemedImageLoading = decorateComponentWithProps(ImageLoadingComponent, {theme});

  const store = {
    getEditorState: undefined,
    setEditorState: undefined,  
  };

  return {
    initialize: ({getEditorState, setEditorState}) => {
      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;  
    },
    blockRendererFn: (block, {getEditorState}) => {
      if(block.getType() === 'atomic'){
        const contentState = getEditorState().getCurrentContent();
        const entityKey = block.getEntityAt(0);
        if(!entityKey) return null;
        const entity = contentState.getEntity(entityKey);
        const type = entity.getType();
        const imageLoading = entity.getData()['imageLoading'];
        if((type === 'IMAGE' || type === 'image') && imageLoading){
          return {
            component: ThemedImageLoading,
            editable: false,
          };  
        }
        return null        
      }
      return null;  
    },
    ImageButton,
    ImageComponent: decorateComponentWithProps(ImageComponent, {theme, store}),
  };
};