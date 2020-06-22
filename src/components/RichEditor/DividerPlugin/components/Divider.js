import React from 'react';
import classNames from 'classnames';

const Divider = ({block, className, theme={}, ...otherProps}) => {
  const {
    blockProps,
    customStyleMap, // eslint-disable-line no-unused-vars
    customStyleFn, // eslint-disable-line no-unused-vars
    decorator, // eslint-disable-line no-unused-vars
    forceSelection, // eslint-disable-line no-unused-vars
    offsetKey, // eslint-disable-line no-unused-vars
    selection, // eslint-disable-line no-unused-vars
    tree, // eslint-disable-line no-unused-vars
    contentState,
    blockStyleFn,
    ...elementProps  
  } = otherProps;
  const combinedClassName = classNames(theme.divider, className);
  const {isFocused} = blockProps;

  const dividerWrapperCls = classNames(
    theme.dividerWrapper,
    {
      [theme.isFocused]: isFocused,
      [theme.unfocused]: !isFocused
    }
  );

  return (
    <div className={dividerWrapperCls}>
      <hr {...elementProps} className={combinedClassName}/>
    </div>
  );  
};

export default Divider;