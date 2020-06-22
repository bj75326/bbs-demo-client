import React from 'react';
import UndoButton from './components/UndoButton';
import RedoButton from './components/RedoButton';

export default (config = {}) => {
  
  const DecoratedUndoButton = props => (
    <UndoButton {...props} />
  );

  const DecoratedRedoButton = props => (
    <RedoButton {...props} />  
  );

  return {
    UndoButton: DecoratedUndoButton,
    RedoButton: DecoratedRedoButton,
  };
};