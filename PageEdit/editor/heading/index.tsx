import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useCore } from "components/core-sub/context";

import update from "react-addons-update";
import { HeaderEditor } from "../../../HeaderEditor";
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
  } = usePE();

  const handleChange = (value: string) => {
    setData((d) =>
      update(d, {
        contents: {
          [index]: {
            heading: {
              $apply: (heading: PageContentTypes["heading"]) => {
                if (heading) {
                  return { ...heading, value };
                } else {
                  return { value };
                }
              },
            },
          },
        },
      })
    );
  };
  const handleChangeOption = (key: string, value: any) => {
    setData((d) =>
      update(d, {
        contents: {
          [index]: {
            heading: {
              $apply: (heading: PageContentTypes["heading"]) => {
                if (heading) {
                  return { ...heading, [key]: value };
                } else {
                  return { [key]: value };
                }
              },
            },
          },
        },
      })
    );
  };
  const handleFocus = (value: boolean) => () =>
    setState((s) => ({ ...s, focus: value ? content.key : null }));
  const handleConvertToParagraph = () => {
    const newContent: PageContentTypes = {
      key: content.key,
      type: "paragraph",
      paragraph: {
        value: content.heading?.value,
      },
    };
    setData((d) => update(d, { contents: { [index]: { $set: newContent } } }));
  };

  return (
    <PEPanel
      content={content}
      contentKey={content.key}
      index={index}
      actions={
        <ListItemButton onClick={handleConvertToParagraph}>
          <ListItemIcon>
            <FontAwesomeIcon icon={["far", "retweet"]} />
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
