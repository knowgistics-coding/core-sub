import { Box, BoxProps, styled } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";
import { EditorState, RawDraftContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import React, {
  startTransition,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { Editor, EditorProps } from "react-draft-wysiwyg";
import { useCore } from "../context";
import { AbsatzCtl } from "./ctl";
import { toolbar } from "./toolbar";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Root = styled(Box, {
  shouldForwardProp: (prop) => !["view", "variant", "noDense"].includes(String(prop)),
})<{
  view?: boolean;
  variant?: Variant;
  noDense?: boolean
}>(({ theme, view, variant, noDense }) => ({
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
  "& .rdw-editor-main, .public-DraftEditor-content": {
    ...theme.typography[variant || "body2"],
    border: view ? undefined : `solid 1px ${theme.palette.divider}`,
    borderTop: "none",
  },
  '& div[data-block="true"]': {
    overflow: "hidden",
  },
  "& .public-DraftStyleDefault-block": {
    margin: noDense ? theme.spacing(0.5, 0) : 0,
  },
  "& .public-DraftEditorPlaceholder-inner": {
    margin: noDense ? theme.spacing(0.5, 0) : 0,
  }
}));

export type AbsatzProps = Pick<BoxProps, "id" | "sx"> & {
  ref?: (ref: object) => void;
  view?: boolean;
  variant?: Variant;
  value?: string;
  onChange?: (value: string) => void;
  onEnter?: (values: string[]) => void;
  autoFocus?: boolean;
  autoHideToolbar?: boolean;
  noDense?: boolean
  componentProps?: {
    root?: Omit<BoxProps, "children" | "sx" | "id">;
    editor?: EditorProps;
  };
};

type StateType = {
  html: string;
  editorState: EditorState;
  contentState: RawDraftContentState;
};

const reducer = (
  state: StateType,
  action: {
    type: "editor" | "content" | "html" | "init";
    editorState?: EditorState;
    contentState?: RawDraftContentState;
    html?: string;
  }
): StateType => {
  switch (action.type) {
    case "editor":
      return { ...state, editorState: action.editorState ?? state.editorState };
    case "content":
      return {
        ...state,
        contentState: action.contentState ?? state.contentState,
      };
    case "init":
      return action.html && state.html !== action.html
        ? {
            ...state,
            editorState: AbsatzCtl.htmlToEditor(action.html),
            html: action.html,
          }
        : state;
    case "html":
      return { ...state, html: action.html ?? state.html };
    default:
      return state;
  }
};

export const Absatz = React.memo((props: AbsatzProps) => {
  const { t } = useCore();
  const editorRef = useRef<any>();
  const [focus, setFocus] = useState<boolean>(false);
  const [state, dispatch] = useReducer(reducer, {
    html: "",
    editorState: props.value
      ? AbsatzCtl.htmlToEditor(props.value!)
      : EditorState.createEmpty(),
    contentState: AbsatzCtl.createEmptyContentState(),
  });
  const view: boolean = props.view
    ? true
    : props.autoHideToolbar
    ? !focus
    : false;

  useEffect(() => {
    if (props.value) {
      dispatch({ type: "init", html: props.value });
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
    dispatch({ type: "editor", editorState });

  const handleContentStateChange = (contentState: RawDraftContentState) => {
    dispatch({ type: "content", contentState });
    startTransition(() => {
      dispatch({ type: "html", html: draftToHtml(contentState) });
      props.onChange?.(draftToHtml(contentState));
      const paragraphs = AbsatzCtl.paragraphSplit(contentState);
      if (paragraphs.length > 1) {
        props.onEnter?.(paragraphs);
      }
    });
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
      noDense={props.noDense}
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

export default Absatz;
