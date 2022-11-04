import {
  List,
  ListItemText,
  ListItemSecondaryAction,
  ListItem,
  Divider,
  Collapse,
} from "@mui/material";
import { useState } from "react";
import ActionIcon from "../../ActionIcon";
import { useCore } from "../../context";
import { Map } from "../../Controller/map";
import { KuiActionIcon } from "../../KuiActionIcon";
import { KuiList } from "../../KuiList";
import { MapsPicker } from "../../MapsPicker";
import { usePopup } from "../../Popup";
import { usePE } from "../context";

export const PEMaps = () => {
  const { t } = useCore();
  const { data, setData } = usePE();
  const [open, setOpen] = useState<Record<"map" | "show", boolean>>({
    map: false,
    show: false,
  });
  const {
    Popup: { remove },
  } = usePopup();

  const handleAddMap = (maps: Map[]) => setData(data.mapAdd(maps));
  const handleRemove = (map: Map) => () => {
    remove({
      title: t("Remove"),
      text: t("Do You Want To Remove $Name", { name: map.title }),
      icon: "trash",
      onConfirm: () => {
        setData(data.mapRemove(map.id));
      },
    });
  };

  return (
    <>
      <List>
        <ListItem dense>
          <ListItemText
            primary={t("MAPS") + ` (${data.maps.length})`}
            primaryTypographyProps={{
              variant: "caption",
              color: "textSecondary",
            }}
          />
          <ListItemSecondaryAction>
            <ActionIcon
              icon="chevron-down"
              iconProps={{
                rotation: open.show ? 180 : undefined,
                style: { transition: "all 0.25s" },
              }}
              onClick={() => setOpen((o) => ({ ...o, show: !o.show }))}
            />
            <KuiActionIcon
              tx="add"
              onClick={() => setOpen((s) => ({ ...s, map: true }))}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={open.show}>
          <KuiList length={data.maps.length}>
            {data.maps.map((item) => (
              <ListItem dense key={item.id}>
                <ListItemText primary={item.title} />
                <ListItemSecondaryAction>
                  <KuiActionIcon tx="remove" onClick={handleRemove(item)} />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </KuiList>
        </Collapse>
        <Divider />
      </List>
      <MapsPicker
        open={open.map}
        onClose={() => setOpen((s) => ({ ...s, map: false }))}
        onConfirm={handleAddMap}
      />
    </>
  );
};
