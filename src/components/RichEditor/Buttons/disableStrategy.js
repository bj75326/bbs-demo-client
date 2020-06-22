const crossBlockCheck = editorState => {
  const selection = editorState.getSelection();
  if(selection.isCollapsed()) return false;

  const startKey = selection.getStartKey();
  const endKey = selection.getEndKey();
  if(startKey !== endKey){
    return true;
  }
  return false;
}

const disableStrategy = {
  'BOLD': ['code-block', 'atomic'],
  'ITALIC': ['code-block', 'atomic'],
  'header-two': ['atomic'],
  'blockquote': ['atomic'],
  'code-block': ['atomic'],
  'ordered-list-item': ['atomic'],
  'unordered-list-item': ['atomic'],
  'ANCHOR': ['code-block', 'atomic', crossBlockCheck],
  'IMAGE': ['code-block', 'atomic'],
  'DIVIDER': ['code-block', 'atomic'],
  'MATHJAX': ['code-block', 'atomic'],
};

const shouldButtonDisabled = (editorState, type) => {
  const rules = disableStrategy[type];
  const currentType = editorState
    .getCurrentContent()
    .getBlockForKey(editorState.getSelection().getStartKey())
    .getType();
  return rules.some(rule => {
    if(typeof rule === 'string' && rule === currentType){
      return true;       
    }
    if(typeof rule === 'function'){
      return rule(editorState, type);  
    }
    return false;
  });
};

export default shouldButtonDisabled;