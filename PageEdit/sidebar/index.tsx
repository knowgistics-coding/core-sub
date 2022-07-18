import { useAlerts } from "../../Alerts";
import { BackLink } from "../../BackLink";
import { useCore } from "../../context";
import { SaveButton } from "../../SaveButton";
import { usePE } from "../context";
import { FeatureImageEdit } from "../../FeatureImage";
import {
  Button,
  FormControl,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment } from "react";
import { TitleDebounce } from "components/core-sub/TitleDebounce";
import update from "react-addons-update";

export const PESidebar = () => {
  const { t } = useCore();
  const {
    data,
    setData,
    show,
    back,
    onSave,
    state,
    setState,
    onPreview,
    sidebarActions,
  } = usePE();
  const { addAlert } = useAlerts();

  const handleSave = async () => {
    setState((s) => ({ ...s, loading: true }));
    const result = await onSave();
    if (result) {
      addAlert({ label: t("Saved") });
    }
    setState((s) => ({ ...s, loading: false }));
  };

  return (
    <Fragment>
      {back && <BackLink to={back} divider />}
      <SaveButton loading={state.loading} onSave={handleSave} />
      {onPreview && (
        <ListItem divider>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<FontAwesomeIcon icon={["fad", "eye"]} />}
            onClick={onPreview}
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
          onRemove={() =>
            setData((d) => {
              delete d.feature;
              return d;
            })
          }
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
      {sidebarActions}
    </Fragment>
  );
};
