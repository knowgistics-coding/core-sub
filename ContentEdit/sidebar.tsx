import { List, ListItem, ListItemText } from "@mui/material";

import { BackLink } from "../BackLink";
import { QuickTextField } from "../QuickTextField";
import { useCE } from "./ctx";
import { useCore } from "../context";
import { CEButtonSave } from "./sidebar.comp/save.button";
import { FeatureImageEdit } from "../FeatureImage";
import { CEVisibility } from "./visibility";
import { StockDisplayProps } from "../StockDisplay";
import { Fragment } from "react";

export const CESidebar = () => {
  const { t } = useCore();
  const { back, data, setData, show } = useCE();

  const handleChangeTitle = (value: string) => {
    setData((d: any) => ({ ...d, title: value }));
  };
  const handleChangeCover = (cover: StockDisplayProps) =>
    setData((d) => ({ ...d, cover }));
  const handleRemoveFeature = () => {
    setData((d) => ({ ...d, cover: undefined }));
  };

  return (
    <Fragment>
      {back && <BackLink to={back} divider />}
      <List>
        <CEButtonSave />
        {show.includes("title") && (
          <ListItem divider>
            <ListItemText
              primary={t("Title")}
              secondary={
                <QuickTextField
                  variant="h6"
                  placeholder={t("No title")}
                  value={data.title || ""}
                  onChange={handleChangeTitle}
                />
              }
              primaryTypographyProps={{
                variant: "caption",
                color: "textSecondary",
              }}
              secondaryTypographyProps={{ component: "div" }}
            />
          </ListItem>
        )}
        {show.includes("feature") && (
          <FeatureImageEdit
            value={data.cover}
            onChange={handleChangeCover}
            onRemove={handleRemoveFeature}
          />
        )}
        {show.includes("visibility") && <CEVisibility />}
      </List>
    </Fragment>
  );
};
