import { Box, Stack, styled, TextField, Typography } from "@mui/material";
import { deepmerge } from "@mui/utils";
import { DataGrid as DG, DataGridProps as DGP } from "@mui/x-data-grid";
import { useState } from "react";
import { useCore } from "../context";

const DataGridStyled = styled(DG)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  "& .Mui-checked": {
    color: theme.palette.info.main,
  },
}));

export interface DataGridProps extends Omit<DGP, "autoHeight"> {
  height?: number;
  searchable?: boolean;
}
export const DataGrid = ({
  height,
  searchable,
  rows,
  initialState,
  componentsProps,
  ...props
}: DataGridProps) => {
  const { t } = useCore();
  const [q, setQ] = useState<string>("");

  const searchFilter = (): readonly any[] => {
    if (q) {
      const splited = `${q}`.split(" ");
      console.log(
        rows.filter((row) =>
          splited.every((txt) => JSON.stringify(row).includes(txt))
        )
      );
      return rows.filter((row) =>
        splited.every((txt) => JSON.stringify(row).includes(txt))
      );
    }
    return rows;
  };

  /**
   * LOCALE
   * https://github.com/mui-org/material-ui-x/blob/HEAD/packages/grid/_modules_/grid/constants/localeTextConstants.ts
   */
  return (
    <>
      {searchable && (
        <Stack spacing={1} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={t("Search")}
            sx={{ backgroundColor: "background.paper" }}
            onChange={({ target: { value } }) => setQ(value)}
          />
          {q.length > 0 && (
            <Typography variant="caption" color="textSecondary">
              "{q}"{" "}
              {t("Found $Amount", { amount: searchFilter().length.toString() })}
            </Typography>
          )}
        </Stack>
      )}
      <Box sx={{ height }}>
        <DataGridStyled
          initialState={deepmerge(
            {
              pagination: {
                pageSize: 10,
              },
            },
            initialState
          )}
          autoHeight
          localeText={{
            noRowsLabel: t("No rows"),
            columnMenuShowColumns: t("Show columns"),
            columnMenuFilter: t("Filter"),
            columnMenuHideColumn: t("Hide"),
            columnMenuUnsort: t("Unsort"),
            columnMenuSortAsc: t("Sort by ASC"),
            columnMenuSortDesc: t("Sort by DESC"),
            footerRowSelected: (count) =>
              t("$Name Selected", { name: String(count) }),
          }}
          componentsProps={deepmerge(
            {
              baseCheckbox: { color: "info" },
              pagination: {
                labelRowsPerPage: t("Rows per page"),
              },
            },
            componentsProps
          )}
          rowsPerPageOptions={[10, 20, 50, 100, 200]}
          disableSelectionOnClick
          {...props}
          rows={searchFilter()}
        />
      </Box>
    </>
  );
};
