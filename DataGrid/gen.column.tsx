import { Avatar, Link } from "@mui/material";
import { GridEnrichedColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { GridInitialStateCommunity } from "@mui/x-data-grid/models/gridStateCommunity";
import { TFunction } from "../context";
import { Time } from "../Controller/time";
import { KuiActionIcon } from "../KuiActionIcon";
import { VisibilityTabsValue } from "../VisibilityTabs";
import { Link as RLink } from "react-router-dom";

export const genColumn = {
  //ANCHOR - init
  init: (): GridInitialStateCommunity => ({
    sorting: {
      sortModel: [{ field: "datemodified", sort: "desc" }],
    },
  }),
  //ANCHOR - rows
  rows: (docs: any[], tab: VisibilityTabsValue) =>
    docs.filter((doc: any) => doc?.visibility === tab),
  //ANCHOR - action
  action: <T extends unknown>(action: {
    onEdit: (row: T) => void;
    onRemove: (row: T) => void;
    onRestore: (row: T) => void;
    onRemoveTrash: (row: T) => void;
  }): GridEnrichedColDef => ({
    field: "action",
    headerName: " ",
    width: 64,
    renderCell: ({ row }: GridRenderCellParams) => {
      switch (row.visibility) {
        case "public":
        case "private":
          return (
            <>
              <KuiActionIcon
                tx="edit"
                onClick={() => action.onEdit(row as T)}
              />
              <KuiActionIcon
                tx="remove"
                onClick={() => action.onRemove(row as T)}
              />
            </>
          );
        case "trash":
          return (
            <>
              <KuiActionIcon
                tx="restore"
                onClick={() => action.onRestore(row as T)}
              />
              <KuiActionIcon
                tx="remove"
                onClick={() => action.onRemoveTrash(row as T)}
              />
            </>
          );
        default:
          return <></>;
      }
    },
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    align: "center",
  }),
  //ANCHOR - title
  title: (t: TFunction, to: string): GridEnrichedColDef => ({
    field: "title",
    headerName: t("Title"),
    renderCell: ({ row }) => (
      <Link component={RLink} to={`${to}/${row.id}`} target="_blank">
        {row.title}
      </Link>
    ),
    width: 360,
  }),
  //ANCHOR - feature
  feature: (): GridEnrichedColDef => ({
    field: "feature",
    headerName: " ",
    renderCell: ({ value }: GridRenderCellParams<any, any, any>) => (
      <Avatar
        variant="square"
        src={`https://s1.phra.in:8086/file/id/${value?.image?._id}/thumbnail`}
      />
    ),
    width: 64,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    align: "center",
  }),
  //ANCHOR - date
  date: (t: TFunction) => ({
    field: "datemodified",
    headerName: t("Date"),
    width: 240,
    renderCell: ({ value }: GridRenderCellParams<any, any, any>) =>
      new Time(value).toString(),
  }),
};
