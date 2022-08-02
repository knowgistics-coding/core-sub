import React from "react";
import { Editor, EditorProps } from "react-draft-wysiwyg";
import { toolbar } from './toolbar'

export interface AbsatzProps {
  componentProps?: {
    editor?: EditorProps;
  };
}
export const Absatz = React.memo((props: AbsatzProps) => {
  return (
    <div>
      <Editor toolbar={toolbar()} {...props.componentProps?.editor} />
    </div>
  );
});
