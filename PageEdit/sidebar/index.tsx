import { useCore } from "../../context";
import { usePE } from "../context";
import { FeatureImageEdit } from "../../FeatureImage";
import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Fragment } from "react";
import { TitleDebounce } from "../../TitleDebounce";
import update from "react-addons-update";
import { useAlerts } from "../../Alerts";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../../Popup";
import { PickIcon } from "../../PickIcon";

export const PESidebar = () => {
  const { t } = useCore();
  const {
    data,
    state: { hideToolbar },
    setState,
    setData,
    onSave,
    show,
    back,
    onPreview,
    sidebarActions,
  } = usePE();
  const { Popup } = usePopup();
  const { addAlert } = useAlerts();
  const nav = useNavigate();

  // const handleSave = async () => {
  //   setState((s) => ({ ...s, loading: true }));
  //   const result = await onSave();
  //   if (result) {
  //     addAlert({ label: t("Saved") });
  //   }
  //   setState((s) => ({ ...s, loading: false }));
  // };
  const handleChangeHideToolbar = (value: boolean) =>
    setState((s) => ({ ...s, hideToolbar: value }));
  const handleBack = () => {
    Popup.confirm({
      title: t("Confirm"),
      text: t("Save Before Leave"),
      icon: "question-circle",
      onConfirm: async () => {
        setState((s) => ({ ...s, loading: true }));
        const result = await onSave();
        if (result) {
          addAlert({ label: t("Saved") });
        }
        setState((s) => ({ ...s, loading: false }));
        nav(back!);
      },
      onAbort: () => nav(back!),
    });
  };

  return (
    <Fragment>
      {back && (
        <ListItem divider>
          <Button
            startIcon={<PickIcon icon={"chevron-left"} />}
            color="neutral"
            onClick={handleBack}
          >
            {t("Back")}
          </Button>
        </ListItem>
      )}
      {/* <SaveButton loading={state.loading} onSave={handleSave} /> */}
      {onPreview && (
        <ListItem divider>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<PickIcon icon={"eye"} />}
            onClick={onPreview}
            color="neutral"
          >
            {t("Preview")}
          </Button>
        </ListItem>
      )}
      {show.includes("title") && (
        <TitleDebounce
          value={data.title}
          onChange={(value) =>
            setData((d) => update(d, { title: { $set: value } }))
          }
        />
      )}
      {show.includes("feature") && (
        <FeatureImageEdit
          value={data.feature}
          onChange={(feature) => setData((d) => ({ ...d, feature }))}
          onRemove={() => setData((d) => ({ ...d, feature: null }))}
        />
      )}
      {show.includes("visibility") && (
        <ListItem divider sx={{ pt: 2 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>{t("Visibility")}</InputLabel>
            <Select
              label={t("Visibility")}
              value={data.visibility || ""}
              onChange={(event: SelectChangeEvent<string>) => {
                const value = event.target.value as "private" | "public";
                setData((d) => ({ ...d, visibility: value }));
              }}
            >
              <MenuItem value="" disabled>
                -- {t("Select?", { name: t("Visibility") })} --
              </MenuItem>
              <MenuItem value="private">{t("Private")}</MenuItem>
              <MenuItem value="public">{t("Public")}</MenuItem>
            </Select>
          </FormControl>
        </ListItem>
      )}
      <List>
        <ListItemButton
          divider
          onClick={() => handleChangeHideToolbar(!hideToolbar)}
        >
          <ListItemIcon>
            <Checkbox
              edge="start"
              size="small"
              checked={hideToolbar}
              color="info"
              onChange={(_e, checked) => handleChangeHideToolbar(checked)}
            />
          </ListItemIcon>
          <ListItemText
            primary={t("Hide Toolbar")}
            primaryTypographyProps={{ variant: "body2" }}
          />
        </ListItemButton>
      </List>
      {sidebarActions}
    </Fragment>
  );
};
