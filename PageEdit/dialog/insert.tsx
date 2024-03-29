import { ShowTypes, usePE } from "../context";
import { Blocks } from "../content/blocks";
import {
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import update from "react-addons-update";
import { useCore } from "../../context";
import { DialogCompact } from "../../DialogCompact";

const genKey = (): string => Math.round(Math.random() * 1000000).toString();

export const DialogInsert = () => {
  const { t } = useCore();
  const {
    show,
    data,
    setData,
    state: { insert },
    setState,
  } = usePE();

  const handleClose = () => setState((s) => ({ ...s, insert: null }));
  const handleAdd = (type: ShowTypes) => () => {
    const index = data.contents?.findIndex((content) => content.key === insert);
    if (typeof index === "number" && index > -1) {
      setData((d) => ({
        ...d,
        contents: update(d.contents || [], {
          $splice: [[index, 0, { type, key: genKey() }]],
        }),
      }));
      console.log(index, type);
    }
    handleClose();
  };

  return (
    <DialogCompact
      open={Boolean(insert)}
      title={t("Insert Before")}
      onClose={handleClose}
      icon="diagram-predecessor"
    >
      <List>
        <Divider />
        {Blocks.filter((block) => show.includes(block.key)).map((block) => (
          <ListItemButton
            divider
            key={block.key}
            onClick={handleAdd(block.key)}
          >
            <ListItemIcon>
              <FontAwesomeIcon icon={block.icon} />
            </ListItemIcon>
            <ListItemText primary={t(block.title)} />
          </ListItemButton>
        ))}
      </List>
    </DialogCompact>
  );
};
