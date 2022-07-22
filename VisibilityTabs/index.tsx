import { Box, styled, Tab, Tabs } from "@mui/material";
import { useCore } from "../context";

const TabsStyled = styled(Tabs)(({theme}) => ({
  "& .MuiTabs-indicator": {
    backgroundColor: theme.palette.info.main,
  },
}))
const TabStyled = styled(Tab)(({ theme }) => ({
  "&.Mui-selected": {
    color: theme.palette.info.main,
  },
}));

export type VisibilityTabsValue = "public" | "private" | "trash";
export type VisibilityTabsProps = {
  value?: VisibilityTabsValue;
  count?: Record<VisibilityTabsValue, number>;
  onChange?: (value: VisibilityTabsValue) => void;
};

export const VisibilityTabs = ({
  value,
  onChange,
  count,
}: VisibilityTabsProps) => {
  const { t } = useCore();

  return (
    <Box sx={{ display: "flex", justifyContent: "center", pb: 2 }}>
      <TabsStyled
        value={value}
        onChange={(_e, newValue) => onChange?.(newValue || value)}
        textColor="primary"
        indicatorColor="primary"
      >
        <TabStyled
          label={`${t("Public")} (${count?.public || "0"})`}
          value="public"
        />
        <TabStyled
          label={`${t("Private")} (${count?.private || "0"})`}
          value="private"
        />
        <TabStyled
          label={`${t("Trash")} (${count?.trash || "0"})`}
          value="trash"
        />
      </TabsStyled>
    </Box>
  );
};
