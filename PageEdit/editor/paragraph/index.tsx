import { PEPanel } from "../../panel";
import { PEEditorProps } from "../heading";
import { usePE } from "../../context";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useCore } from "../../../context";
import { Absatz } from "../../../Absatz";
import { PickIcon } from "../../../PickIcon";

export const PEEditorParagraph = ({ index, content }: PEEditorProps) => {
  const { t } = useCore();
  const {
    state: { focus },
    setState,
    setData,
    pageData,
  } = usePE();

  const handleChange = (value: string) => {
    setData(
      pageData.content.update(content.key, "paragraph", { value }).toJSON()
    );
  };
  const handleEnter = (paragraphs: string[]) => {
    setData(
      pageData.paragraph
        .enter(content.key, paragraphs, (focus) => {
          setState((s) => ({ ...s, focus }));
        })
        .toJSON()
    );
  };
  const handleConvertToHeading = () =>
    setData(pageData.paragraph.convertToHeading(content.key).toJSON());

  return (
    <PEPanel
      contentKey={content.key}
      content={content}
      index={index}
      actions={
        <ListItemButton onClick={handleConvertToHeading}>
          <ListItemIcon>
            <PickIcon icon={"retweet"} />
          </ListItemIcon>
          <ListItemText
            primary={t("Convert to $Name", { name: t("Heading") })}
          />
        </ListItemButton>
      }
    >
      <Absatz
        autoHideToolbar
        autoFocus={focus === content.key}
        value={content.paragraph?.value}
        onChange={handleChange}
        onEnter={handleEnter}
      />
    </PEPanel>
  );
};
