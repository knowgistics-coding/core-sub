import {
  Box,
  styled,
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
} from "@mui/material";
import { useCore } from "../context";

const ToggleButtonStyled = styled(ToggleButton)(({ theme }) => ({
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

export type VisibilityTabsProps = Pick<
  ToggleButtonGroupProps,
  "value" | "onChange"
> & { count?: Record<"public" | "private" | "trash", number> };

export const VisibilityTabs = ({
  value,
  onChange,
  count,
}: VisibilityTabsProps) => {
  const { t } = useCore();

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", pb: 2 }}>
      <ToggleButtonGroup
        size="small"
        exclusive
        value={value}
        onChange={onChange}
        sx={{ backgroundColor: "background.default" }}
      >
        <ToggleButtonStyled value="public">
          {t("Public")} ({count?.public || "0"})
        </ToggleButtonStyled>
        <ToggleButtonStyled value="private">
          {t("Private")} ({count?.private || "0"})
        </ToggleButtonStyled>
        <ToggleButtonStyled value="trash">
          {t("Trash")} ({count?.trash || "0"})
        </ToggleButtonStyled>
      </ToggleButtonGroup>
    </Box>
  );
};
