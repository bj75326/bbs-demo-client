import { SelectionState, EditorState } from 'draft-js';
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';

export default (getEditorState, setEditorState, newActiveBlock, currEditorState) => {
  const editorState = currEditorState || getEditorState();

  const offsetKey = DraftOffsetKey.encode(newActiveBlock.getKey(), 0, 0);
  const node = document.querySelectorAll(`[data-offset-key="${offsetKey}"]`)[0];
  
  const selection = window.getSelection();
  const range = document.createRange();
  range.setStart(node, 0);
  range.setEnd(node, 0);
  selection.removeAllRanges();
  selection.addRange(range);

  //need to set 'noFocus' as False here.
  editorState.getCurrentContent().mergeEntityData(newActiveBlock.getEntityAt(0), {
    noFocus: false  
  });

  setEditorState(
    EditorState.forceSelection(
      editorState,
      new SelectionState({
        anchorKey: newActiveBlock.getKey(),
        anchorOffset: 0,
        focusKey: newActiveBlock.getKey(),
        focusOffset: 0,
        isBackward: false,
      })
    )
  );
};