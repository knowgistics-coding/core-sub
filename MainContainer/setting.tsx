import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { useMC } from "./ctx";
import i18next from "i18next";
import { SystemMode, useCore } from "../context";
import { useTranslation } from "react-i18next";
import { DialogCompact } from "../DialogCompact";
// import { MCLine } from './line'

export const MCSetting = () => {
  const { open, handleOpen } = useMC();
  const { systemState, setSystemState } = useCore();
  const { t } = useTranslation();
  const lang = i18next.language;

  const handleChangeLang = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    i18next.changeLanguage(value);
    window.localStorage.setItem("defaultLanguage", value);
  };

  return (
    <DialogCompact
      open={open.setting}
      onClose={handleOpen("setting", false)}
      title={t("Setting")}
      icon="cog"
    >
      <Stack spacing={2}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>{t("Language")}</InputLabel>
          <Select
            label={t("Language") + "A"}
            value={["en", "th"].includes(lang) ? lang : "th"}
            onChange={handleChangeLang}
          >
            <MenuItem value="" disabled>
              -- {t("Choose$Name", { name: t("Language") })} --
            </MenuItem>
            <MenuItem value="th">ไทย</MenuItem>
            <MenuItem value="en">English</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>{t("Appearance")}</InputLabel>
          <Select
            label={t("Appearance") + "A"}
            value={systemState.mode}
            onChange={({ target: { value } }) => {
              setSystemState((s) => ({ ...s, mode: value as SystemMode }));
              localStorage.setItem("mode", value);
            }}
          >
            <MenuItem value="default">{t("SystemDefault")}</MenuItem>
            <MenuItem value="light">{t("Light")}</MenuItem>
            <MenuItem value="dark">{t("Dark")}</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      {/* <GridName>{t('Line Application')}</GridName>
          <GridSet>
            <MCLine />
          </GridSet> */}
    </DialogCompact>
  );
};
