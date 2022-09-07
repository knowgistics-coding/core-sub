import { Box, styled, Tab, Tabs } from "@mui/material";
import { useEffect } from "react";
import { useCore } from "../context";

const TabsStyled = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    backgroundColor: theme.palette.info.main,
  },
}));
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
  items?: { visibility: VisibilityTabsValue }[];
};

export const VisibilityTabs = ({
  value,
  onChange,
  count,
  items,
}: VisibilityTabsProps) => {
  const { t } = useCore();

  useEffect(() => {
    const lastValue = localStorage.getItem("viaibilityTabLastValue");
    if (!!lastValue && onChange) {
      onChange(lastValue as VisibilityTabsValue);
    }
  }, [onChange]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", pb: 2 }}>
      <TabsStyled
        value={value}
        onChange={(_e, newValue) => {
          localStorage.setItem("viaibilityTabLastValue", newValue);
          onChange?.(newValue || value);
        }}
        textColor="primary"
        indicatorColor="primary"
      >
        <TabStyled
          label={`${t("Public")} (${
            count?.public ||
            items?.filter((i) => i.visibility === "public").length ||
            "0"
          })`}
          value="public"
        />
        <TabStyled
          label={`${t("Private")} (${
            count?.private ||
            items?.filter((i) => i.visibility === "private").length ||
            "0"
          })`}
          value="private"
        />
        <TabStyled
          label={`${t("Trash")} (${
            count?.trash ||
            items?.filter((i) => i.visibility === "trash").length ||
            "0"
          })`}
          value="trash"
        />
      </TabsStyled>
    </Box>
  );
};
