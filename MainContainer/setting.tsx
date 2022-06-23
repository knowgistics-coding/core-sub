import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { KuiButton } from "../KuiButton";
import { useMC } from "./ctx";
import i18next from "i18next";
import { SystemMode, useCore } from "../context";
import { useTranslation } from "react-i18next";
// import { MCLine } from './line'

const GridName = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Grid item xs={12} sm={4}>
      <Typography variant="body1" color={"textSecondary"}>
        {children}
      </Typography>
    </Grid>
  );
};
const GridSet = ({
  children,
  dense,
}: {
  children?: React.ReactNode;
  dense?: boolean;
}) => {
  return (
    <Grid item xs={12} sm={8}>
      {children}
    </Grid>
  );
};

export const MCSetting = () => {
  const { open, handleOpen } = useMC();
  const { isMobile, systemState, setSystemState } = useCore();
  const { t } = useTranslation();
  const lang = i18next.language;

  const handleChangeLang = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    i18next.changeLanguage(value);
    window.localStorage.setItem("defaultLanguage", value);
  };

  return (
    <Dialog
      fullWidth
      fullScreen={isMobile}
      maxWidth="xs"
      open={open.setting}
      onClose={handleOpen("setting", false)}
    >
      <DialogTitle>{t("Setting")}</DialogTitle>
      <DialogContent dividers={isMobile} style={{ paddingBottom: 0 }}>
        <Box pt={1} />
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          <GridName>{t("Language")}</GridName>
          <GridSet dense>
            <Select
              fullWidth
              size="small"
              variant="outlined"
              value={["en", "th"].includes(lang) ? lang : "en"}
              onChange={handleChangeLang}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="th">ไทย</MenuItem>
            </Select>
          </GridSet>
          <GridName>{t("DarkMode")}</GridName>
          <GridSet dense>
            <Select
              fullWidth
              size="small"
              value={systemState.mode}
              onChange={({ target: { value } }) => {
                setSystemState((s) => ({ ...s, mode: value as SystemMode }))
                localStorage.setItem("mode", value)
              }}
            >
              <MenuItem value="default">{t("SystemDefault")}</MenuItem>
              <MenuItem value="light">{t("Light")}</MenuItem>
              <MenuItem value="dark">{t("Dark")}</MenuItem>
            </Select>
          </GridSet>
          {/* <GridName>{t('Line Application')}</GridName>
          <GridSet>
            <MCLine />
          </GridSet> */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <KuiButton
          tx="close"
          color="neutral"
          onClick={handleOpen("setting", false)}
        />
      </DialogActions>
    </Dialog>
  );
};
