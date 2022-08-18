import { styled, Typography } from "@mui/material";
import {
  ContentState,
  convertFromHTML,
  EditorState,
  RawDraftContentState,
} from "draft-js";
import { useEffect, useState } from "react";
import { Editor, EditorProps } from "react-draft-wysiwyg";
import { variants, VariantSetting } from "./variant.setting";
import draftToHTML from "draftjs-to-html";
import { useCore } from "../context";

export const toolbar = {
  options: ["history", "textAlign"],
  history: {
    inDropdown: false,
    options: ["undo", "redo"],
  },
  textAlign: {
    inDropdown: true,
    options: ["left", "center", "right"],
  },
};

export interface HeaderEditorProps {
  className?: string;
  value?: string;
  onChange?: (htmlValue: string) => void;
  variant?: variants;
  onChangeOption?: (key: string, value: any) => void;
  editorProps?: Omit<
    EditorProps,
    "toolbar" | "editorState" | "onEditorStateChange" | "onContentStateChange"
  >;
}

export const HeaderEditor = styled(
  ({
    className,
    value,
    onChange,
    variant = "h6",
    onChangeOption,
    editorProps,
  }: HeaderEditorProps) => {
    const { t } = useCore();
    const [editorState, setEditorState] = useState<EditorState | undefined>();

    const handleSetVariant = (value: variants) =>
      onChangeOption?.("variant", value);

    const handleEditorStateChange = (editorState: EditorState) =>
      setEditorState(editorState);
    const handleContentStateChange = (contentState: RawDraftContentState) => {
      onChange?.(draftToHTML(contentState));
    };

    useEffect(() => {
      if (!editorState && value) {
        const { contentBlocks, entityMap } = convertFromHTML(value);
        const editorState = EditorState.createWithContent(
          ContentState.createFromBlockArray(contentBlocks, entityMap)
        );
        setEditorState(editorState);
      }
    }, [value, editorState]);

    return (
      <Typography variant={variant} textAlign="center">
        <Editor
          editorClassName={className}
          toolbar={toolbar}
          toolbarCustomButtons={[
            <VariantSetting
              value={variant}
              onVariantChange={handleSetVariant}
            />,
          ]}
          editorState={editorState}
          onEditorStateChange={handleEditorStateChange}
          onContentStateChange={handleContentStateChange}
          placeholder={t("Start writting or type")}
          {...editorProps}
        />
      </Typography>
    );
  }
)(() => ({
  overflow: "hidden",
  "& .public-DraftStyleDefault-block": {
    margin: "0.1em 0",
  },
}));
