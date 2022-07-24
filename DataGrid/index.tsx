import { Box, TextField } from "@mui/material";
import { DataGrid as DG, DataGridProps as DGP } from "@mui/x-data-grid";
import { useState } from "react";
import { useCore } from "../context";

export interface DataGridProps extends Omit<DGP, "autoHeight"> {
  height?: number;
  searchable?: boolean;
}
export const DataGrid = ({ height, searchable, rows, ...props }: DataGridProps) => {
  const { t } = useCore();
  const [q, setQ] = useState<string>("");

  const searchFilter = (): readonly any[] => {
    if (q) {
      const splited = q.split(" ");
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
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <TextField
            size="small"
            placeholder={t("Search")}
            sx={{ mb: 2 }}
            onChange={({ target: { value } }) => setQ(value)}
          />
        </Box>
      )}
      <Box sx={{ height }}>
        <DG
          sx={{
            backgroundColor: "background.paper",
            "& .Mui-checked": {
              color: "info.main",
            },
          }}
          initialState={{
            pagination: {
              pageSize: 10,
            },
          }}
          autoHeight
          localeText={{
            noRowsLabel: t("No rows"),
            columnMenuShowColumns: t("Show columns"),
            columnMenuFilter: t("Filter"),
            columnMenuHideColumn: t("Hide"),
            columnMenuUnsort: t("Unsort"),
            columnMenuSortAsc: t("Sort by ASC"),
            columnMenuSortDesc: t("Sort by DESC"),
          }}
          componentsProps={{
            pagination: {
              labelRowsPerPage: t("Rows per page"),
            },
          }}
          rowsPerPageOptions={[10, 20, 50, 100, 200]}
          disableSelectionOnClick
          rows={searchFilter()}
          {...props}
        />
      </Box>
    </>
  );
};
