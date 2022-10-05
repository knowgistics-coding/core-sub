import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useCore } from "../../../context";
import { HeaderEditor } from "../../../HeaderEditor";
import { PickIcon } from "../../../PickIcon";
import { PageContentTypes, usePE } from "../../context";
import { PEPanel } from "../../panel";

export interface PEEditorProps {
  index: number;
  content: PageContentTypes;
  isDrag?: boolean;
}
export const PEEditorHeading = ({ index, content }: PEEditorProps) => {
  const { t } = useCore();
  const {
    state: { focus },
    setState,
    setData,
    pageData,
  } = usePE();

  const handleChange = (value: string) => {
    setData(
      pageData.content.update(content.key, "heading", { value }).toJSON()
    );
  };
  const handleChangeOption = (key: string, value: any) => {
    setData(
      pageData.content.update(content.key, "heading", { [key]: value }).toJSON()
    );
  };
  const handleFocus = (value: boolean) => () =>
    setState((s) => ({ ...s, focus: value ? content.key : null }));
  const handleConvertToParagraph = () => {
    setData(pageData.content.convertToParagraph(content.key).toJSON());
  };

  return (
    <PEPanel
      content={content}
      contentKey={content.key}
      index={index}
      actions={
        <ListItemButton onClick={handleConvertToParagraph}>
          <ListItemIcon>
            <PickIcon icon={"retweet"} />
          </ListItemIcon>
          <ListItemText
            primary={t("Convert to $Name", { name: t("Paragraph") })}
          />
        </ListItemButton>
      }
    >
      <HeaderEditor
        editorProps={{
          toolbarHidden: focus !== content.key,
          onFocus: handleFocus(true),
          onBlur: handleFocus(false),
        }}
        value={content.heading?.value}
        onChange={handleChange}
        variant={content.heading?.variant}
        onChangeOption={handleChangeOption}
      />
    </PEPanel>
  );
};
