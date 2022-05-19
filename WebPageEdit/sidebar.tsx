import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {Fragment} from "react";

import { BackLink } from "../BackLink";
import { DebounceTextField } from "../DebounceTextField";
import { FeatureImageEdit } from "../FeatureImage";
import { SaveButton } from "../SaveButton";
import { useWebPE } from "./context";

export const WebPESidebar = () => {
  const { data, setData, back, t, onSave } = useWebPE();

  return (
    <Fragment>
      {back && <BackLink to={back} divider />}
      <SaveButton onSave={onSave} />
      <ListItem divider sx={{ pt: 2 }}>
        <DebounceTextField
          fullWidth
          label={t("Title")}
          value={data?.title}
          onChange={(title) => setData((d) => ({ ...d, title }))}
        />
      </ListItem>
      <FeatureImageEdit
        value={data?.feature}
        onChange={(data) => setData((d) => ({ ...d, feature: data }))}
      />
      <List>
        <ListItemButton divider>
          <ListItemIcon>
            <FontAwesomeIcon icon={["fad", "list-ul"]} />
          </ListItemIcon>
          <ListItemText primary="Panel List" />
        </ListItemButton>
      </List>
    </Fragment>
  );
};
