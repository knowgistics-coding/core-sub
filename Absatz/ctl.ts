import {
  ContentState,
  convertToRaw,
  EditorState,
  RawDraftContentState,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

export class AbsatzCtl {
  static createEmptyContentState(): RawDraftContentState {
    const contentState = ContentState.createFromBlockArray([]);
    return convertToRaw(contentState);
  }
  static htmlToEditor(value: string): EditorState {
    if (typeof value === "string") {
      const content = htmlToDraft(value);
      const contentState = ContentState.createFromBlockArray(
        content.contentBlocks,
        content.entityMap
      );
      const editorState = EditorState.createWithContent(contentState);
      return editorState;
    }
    return EditorState.createEmpty();
  }
  static paragraphSplit(contentState: RawDraftContentState): string[] {
    const paragraphs = contentState.blocks
      .map(
        (block): RawDraftContentState => ({
          blocks: [block],
          entityMap: contentState.entityMap,
        })
      )
      .map((content) => draftToHtml(content));
    return paragraphs;
  }
}
