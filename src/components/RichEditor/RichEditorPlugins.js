import createImagePlugin from 'draft-js-image-plugin';
import createImageLoadingPlugin from './ImagePlugin';
import createFocusPlugin from './FocusPlugin';
import createLinkPlugin from './AnchorPlugin';
import createDividerPlugin from './DividerPlugin';
import createMathJaxPlugin from './MathJaxPlugin';
import createUndoPlugin from './UndoPlugin';

export default {
  createImagePlugin,
  createImageLoadingPlugin,
  createFocusPlugin,
  createLinkPlugin,
  createDividerPlugin,
  createMathJaxPlugin,
  createUndoPlugin,
};