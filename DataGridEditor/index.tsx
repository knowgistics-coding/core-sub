import {
  DataGrid,
  GridCellEditCommitParams,
  GridEnrichedColDef,
} from "@mui/x-data-grid";
import * as React from "react";
import {
  DataGridEditorContext,
  DataGridEditorData,
  DataGridEditorProps,
  DataGridEditorDefaultData,
} from "./context";
import { DataGridController as DC } from "./data.grid.controller";
import { Box, Typography } from "@mui/material";
import { IconButton } from "./icon.button";
import { useCore } from "../context";
import { usePopup } from "../react-popup";
import { ColAction, ColMenu } from "./col.menu";
import { ColEdit } from "./col.edit";
import { RowAction, RowMenu } from "./row.menu";

export * from "./context";
export const DataGridEditor = (props: DataGridEditorProps) => {
  const { t } = useCore();
  const { Popup } = usePopup();
  const [dataStr, setDataStr] = React.useState<string>("");
  const [data, setData] = React.useState<DataGridEditorData>(
    DataGridEditorDefaultData
  );
  const [rowMenu, setRowMenu] = React.useState<{
    anchorEl: Element | null;
    key: string;
  }>({ anchorEl: null, key: "" });
  const [colMenu, setColMenu] = React.useState<{
    anchorEl: null | Element;
    key: string;
  }>({ anchorEl: null, key: "" });
  const [colEdit, setColEdit] = React.useState<{
    type?: ColAction;
    open: boolean;
    key: string;
    value: Partial<GridEnrichedColDef>;
  }>({
    open: false,
    key: "",
    value: {},
  });

  const handleCellEditCommit = (
    params: GridCellEditCommitParams,
    event: any
  ) => {
    event?.persist?.();
    const newData = DC.row.change(data, params);
    setData(newData);
    props.onChange?.(newData);
  };

  const handleOpenRowMenu =
    (key: string) =>
    ({ currentTarget }: React.MouseEvent<HTMLButtonElement>) =>
      setRowMenu({ anchorEl: currentTarget, key });
  const handleCloseRowMenu = () => setRowMenu({ anchorEl: null, key: "" });
  const handleRowAction = (action: RowAction) => () => {
    switch (action) {
      case "insertbefore":
        (() => {
          const newData = DC.row.insertBefore(data, rowMenu.key);
          handleCloseRowMenu();
          setData(newData);
          props.onChange?.(newData);
        })();
        return;
      case "insertafter":
        (() => {
          const newData = DC.row.insertAfter(data, rowMenu.key);
          handleCloseRowMenu();
          setData(newData);
          props.onChange?.(newData);
        })();
        return;
      case "remove":
        (() => {
          const newData = DC.row.remove(data, rowMenu.key);
          handleCloseRowMenu();
          setData(newData);
          props.onChange?.(newData);
        })();
        return;
      default:
        return Popup.alert({
          title: t("Error"),
          text: "Invalid Type",
          icon: "exclamation-triangle",
        });
    }
  };

  const handleOpenColMenu =
    (key: string) =>
    ({ currentTarget }: React.MouseEvent<HTMLButtonElement>) =>
      setColMenu({ anchorEl: currentTarget, key });
  const handleCloseColMenu = () => setColMenu({ anchorEl: null, key: "" });
  const handleColAction = (type: ColAction) => () => {
    switch (type) {
      case "edit":
        return setColEdit({
          type: "edit",
          open: true,
          key: colMenu.key,
          value: data.columns.find((col) => col.field === colMenu.key) || {},
        });
      case "insertbefore":
        return setColEdit({
          type: "insertbefore",
          open: true,
          key: colMenu.key,
          value: {},
        });
      case "insertafter":
        return setColEdit({
          type: "insertafter",
          open: true,
          key: colMenu.key,
          value: {},
        });
      case "remove":
        (() => {
          const newData = DC.column.remove(data, colMenu.key);
          handleCloseColMenu();
          setData(newData);
          props.onChange?.(newData);
        })();
        return;
      default:
        return Popup.alert({
          title: t("Error"),
          text: "Invalid Type",
          icon: "exclamation-triangle",
        });
    }
  };
  const handleCloseColEdit = () =>
    setColEdit((d) => ({ ...d, open: false, key: "", value: {} }));
  const handleColEditChange = (updateData: Partial<GridEnrichedColDef>) => {
    if (colEdit.type === "edit" && updateData.field) {
      const newData = DC.column.update(data, updateData.field, updateData);
      setData(newData);
      props.onChange?.(newData);
    } else if (colEdit.type === "insertbefore" && colMenu.key) {
      const newData = DC.column.insertBefore(data, colMenu.key, updateData);
      setData(newData);
      props.onChange?.(newData);
    } else if (colEdit.type === "insertafter" && colMenu.key) {
      const newData = DC.column.insertAfter(data, colMenu.key, updateData);
      setData(newData);
      props.onChange?.(newData);
    }
    handleCloseColEdit();
    handleCloseColMenu();
  };

  React.useEffect(() => {
    if (props.value && JSON.stringify(props.value) !== dataStr) {
      setData(props.value);
      setDataStr(JSON.stringify(props.value));
    }
  }, [props.value, dataStr]);

  return (
    <DataGridEditorContext.Provider value={{ ...props, data, setData }}>
      <DataGrid
        rows={data.rows}
        columns={(props.view !== true
          ? ([
              {
                field: "action",
                headerName: " ",
                width: 36,
                renderCell: ({ row }) => (
                  <IconButton
                    icon="ellipsis-v"
                    onClick={handleOpenRowMenu(row.id)}
                  />
                ),
                align: "center",
              },
            ] as GridEnrichedColDef[])
          : []
        ).concat(
          data.columns.map(
            (column): GridEnrichedColDef => ({
              ...column,
              editable: props.view !== true ? true : false,
              sortable: false,
              renderHeader: (col) => {
                return (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="inherit" noWrap sx={{ flex: 1 }}>
                      {column.headerName}
                    </Typography>
                    {props.view !== true && (
                      <IconButton
                        icon="ellipsis-v"
                        onClick={handleOpenColMenu(col.field)}
                      />
                    )}
                  </Box>
                );
              },
            })
          )
        )}
        autoHeight
        disableSelectionOnClick
        hideFooter
        onCellEditCommit={handleCellEditCommit}
        disableColumnMenu
        sx={{
          "& .MuiDataGrid-columnHeaderTitleContainerContent": {
            width: "100%",
          },
        }}
      />
      <ColMenu
        anchorEl={colMenu.anchorEl}
        onClose={handleCloseColMenu}
        onColAction={handleColAction}
        disableRemove={data.columns.length < 2}
      />
      <ColEdit
        open={colEdit.open}
        value={colEdit.value}
        onClose={handleCloseColEdit}
        onChange={handleColEditChange}
      />
      <RowMenu
        anchorEl={rowMenu.anchorEl}
        onClose={handleCloseRowMenu}
        onRowAction={handleRowAction}
        disabledRemove={data.rows.length < 2}
      />
    </DataGridEditorContext.Provider>
  );
};
