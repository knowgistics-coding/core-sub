import {
  alpha,
  Grid,
  Input,
  Slider,
  styled,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { GridEnrichedColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useCore } from "../context";
import { DialogCompact } from "../DialogCompact";
import { KuiButton } from "../KuiButton";
import { PickIcon } from "../PickIcon";

const Header = styled(Typography)({});
Header.defaultProps = {
  color: "textSecondary",
  variant: "body2",
  sx: { mt: 3, mb: 1 },
};

const ToggleButtonStyled = styled(ToggleButton)(({ theme }) => ({
  "&.Mui-selected": {
    color: theme.palette.info.main,
    backgroundColor: alpha(theme.palette.info.main, 0.125),
    "&:hover": {
      backgroundColor: alpha(theme.palette.info.main, 0.25),
    },
  },
}));

const defaultData = (): Partial<GridEnrichedColDef> => ({
  headerName: "",
  width: 100,
  align: "left",
});

export type ColEditProps = {
  open: boolean;
  onClose: () => void;
  value?: Partial<GridEnrichedColDef>;
  onChange: (value: Partial<GridEnrichedColDef>) => void;
};
export const ColEdit = (props: ColEditProps) => {
  const { t } = useCore();
  const [data, setData] = useState<Partial<GridEnrichedColDef>>({
    headerName: "",
    width: 100,
    align: "left",
  });

  useEffect(() => {
    if (props.value && props.open) {
      setData({ width: 100, ...props.value });
    } else {
      setData(defaultData());
    }
  }, [props.value, props.open]);

  const handleConfirm = () => {
    if (data.headerName && data.width) {
      props.onChange(data);
    }
  };

  return (
    <DialogCompact
      open={props.open}
      onClose={props.onClose}
      title={t("Edit $Name", { name: " Column" })}
      icon="edit"
      actions={
        <KuiButton
          tx="confirm"
          onClick={handleConfirm}
          disabled={!Boolean(data.headerName && data.width)}
        />
      }
    >
      <TextField
        fullWidth
        autoFocus
        label={t("Title")}
        value={data.headerName || ""}
        onChange={({ target: { value } }) =>
          setData((d) => ({ ...d, headerName: value }))
        }
      />
      <Header>{t("Width")}</Header>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            value={typeof data.width === "number" ? data.width : 120}
            min={60}
            max={480}
            onChange={(_event, value) =>
              setData((d) => ({
                ...d,
                width: Array.isArray(value) ? value[0] : value,
              }))
            }
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
          <Input
            value={typeof data.width === "number" ? data.width : 120}
            size="small"
            onChange={({ target: { value } }) =>
              setData((d) => ({ ...d, width: parseInt(value || "0") }))
            }
            onBlur={() => {
              if ((data.width || 0) < 60) {
                setData((d) => ({ ...d, width: 60 }));
              } else if ((data.width || 0) > 480) {
                setData((d) => ({ ...d, width: 480 }));
              }
            }}
            inputProps={{
              step: 10,
              min: 60,
              max: 480,
              type: "number",
              "aria-labelledby": "input-slider",
            }}
          />
        </Grid>
      </Grid>
      <Header>{t("Align")}</Header>
      <ToggleButtonGroup
        fullWidth
        size="small"
        value={data.align}
        onChange={(_event, value) => setData((d) => ({ ...d, align: value }))}
        exclusive
      >
        <ToggleButtonStyled value="left">
          <PickIcon icon={"align-left"} style={{ marginRight: "0.5rem" }} />
          {t("Left")}
        </ToggleButtonStyled>
        <ToggleButtonStyled value="center">
          <PickIcon icon={"align-center"} style={{ marginRight: "0.5rem" }} />
          {t("Center")}
        </ToggleButtonStyled>
        <ToggleButtonStyled value="right">
          <PickIcon icon={"align-right"} style={{ marginRight: "0.5rem" }} />
          {t("Right")}
        </ToggleButtonStyled>
      </ToggleButtonGroup>
    </DialogCompact>
  );
};
