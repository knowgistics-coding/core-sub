import { Box, BoxProps, styled } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";
import { EditorState, RawDraftContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Editor, EditorProps } from "react-draft-wysiwyg";
import { useCore } from "../context";
import { AbsatzCtl } from "./ctl";
import { toolbar } from "./toolbar";

const Root = styled(Box, {
  shouldForwardProp: (prop) => !["view", "variant"].includes(String(prop)),
})<{
  view?: boolean;
  variant?: Variant;
}>(({ theme, view, variant }) => ({
  color: theme.palette.text.primary,
  backgroundColor: view ? undefined : theme.palette.background.paper,
  "& a": {
    color: theme.palette.info.main,
  },
  "& .rdw-editor-toolbar": {
    backgroundColor: theme.palette.background.paper,
    color: "#333333",
    borderColor: theme.palette.divider,
    marginBottom: 0,
  },
  "& .DraftEditor-root": {
    height: "100%",
    overflow: "auto",
  },
  "& .rdw-editor-main": {
    ...theme.typography[variant || "body2"],
    border: view ? undefined : `solid 1px ${theme.palette.divider}`,
    borderTop: "none",
  },
  '& div[data-block="true"]': {
    overflow: "hidden",
  },
  "& .public-DraftStyleDefault-block": {
    margin: 0,
  },
}));

const defaultState = () => ({
  html: "",
  editorState: EditorState.createEmpty(),
  contentState: AbsatzCtl.createEmptyContentState(),
});

export type AbsatzProps = Pick<BoxProps, "id" | "sx"> & {
  ref?: (ref: object) => void;
  view?: boolean;
  variant?: Variant;
  value?: string;
  onChange?: (value: string) => void;
  onEnter?: (values: string[]) => void;
  autoFocus?: boolean;
  autoHideToolbar?: boolean;
  componentProps?: {
    root?: Omit<BoxProps, "children" | "sx" | "id">;
    editor?: EditorProps;
  };
};
export const Absatz = React.memo((props: AbsatzProps) => {
  const { t } = useCore();
  const editorRef = useRef<any>();
  const [focus, setFocus] = useState<boolean>(false);
  const [state, setState] = useState<{
    html: string;
    editorState: EditorState;
    contentState: RawDraftContentState;
  }>(defaultState());
  const view:boolean = props.view ? true : props.autoHideToolbar ? !focus : false

  useEffect(() => {
    if (props.value) {
      if (props.value !== state.html) {
        setState((s) => ({
          ...s,
          editorState: AbsatzCtl.htmlToEditor(props.value!),
        }));
      }
    } else {
      setState(defaultState());
    }
  }, [props.value, state.html]);

  const handleFocus = useCallback(
    (value?: boolean) => {
      if (value) {
        setTimeout(() => {
          editorRef.current?.focus?.();
        }, 500);
      }
    },
    [editorRef]
  );
  const handleEditorStateChange = (editorState: EditorState) =>
    setState((s) => ({ ...s, editorState }));
  const handleContentStateChange = (contentState: RawDraftContentState) => {
    setState((s) => ({ ...s, contentState, html: draftToHtml(contentState) }));
    AbsatzCtl.paragraphSplit(contentState);
    props.onChange?.(draftToHtml(contentState));
    const paragraphs = AbsatzCtl.paragraphSplit(contentState);
    if(paragraphs.length > 1){
      props.onEnter?.(paragraphs);
    }
  };

  useEffect(() => {
    handleFocus(props.autoFocus);
  }, [props.autoFocus, handleFocus]);

  return (
    <Root
      id={props.id}
      sx={props.sx}
      view={view}
      variant={props.variant}
      className="KuiAbsatz-root"
    >
      <Editor
        editorRef={(ref) => {
          editorRef.current = ref;
          props.ref?.(ref);
        }}
        toolbar={toolbar()}
        editorState={state.editorState}
        onEditorStateChange={handleEditorStateChange}
        onContentStateChange={handleContentStateChange}
        toolbarHidden={view}
        readOnly={props.view}
        placeholder={props.view ? undefined : t("TypeHere")}
        onBlur={() => setFocus(false)}
        onFocus={() => setFocus(true)}
        stripPastedStyles
        {...props.componentProps?.editor}
      />
    </Root>
  );
});
