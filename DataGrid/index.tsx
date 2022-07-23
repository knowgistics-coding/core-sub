import { DataGrid as DG, DataGridProps as DGP } from "@mui/x-data-grid";
import { useCore } from "../context";

export interface DataGridProps extends Omit<DGP, "autoHeight"> {}
export const DataGrid = (props: DataGridProps) => {
  const { t } = useCore();

  /**
   * LOCALE
   * https://github.com/mui-org/material-ui-x/blob/HEAD/packages/grid/_modules_/grid/constants/localeTextConstants.ts
   */
  return (
    <DG
      sx={{
        backgroundColor: "background.paper",
      }}
      initialState={{
        pagination: {
          pageSize: 10
        }
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
      {...props}
    />
  );
};
