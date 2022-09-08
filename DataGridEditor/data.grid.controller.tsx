import {
  GridCellEditCommitParams,
  GridColumns,
  GridEnrichedColDef,
} from "@mui/x-data-grid";
import update from "react-addons-update";
import { genKey } from "./gen.key";

export type DataGridRowType = { [key: string]: string } & { id: string };
export type DataGridValues = {
  rows: DataGridRowType[];
  columns: GridColumns;
};

export class DataGridController {
  /**
   *  ______   ______   __     __
   * /\  == \ /\  __ \ /\ \  _ \ \
   * \ \  __< \ \ \/\ \\ \ \/ ".\ \
   *  \ \_\ \_\\ \_____\\ \__/".~\_\
   *   \/_/ /_/ \/_____/ \/_/   \/_/
   */
  static readonly row = {
    getIndex: (data: DataGridValues, id: string | number): number =>
      data.rows.findIndex((row) => row.id === id),
    change: (
      data: DataGridValues,
      params: GridCellEditCommitParams
    ): DataGridValues => {
      const index = this.row.getIndex(data, params.id);
      return index > -1
        ? update(data, {
            rows: { [index]: { $merge: { [params.field]: params.value } } },
          })
        : data;
    },
    insertBefore: (data: DataGridValues, id: string): DataGridValues => {
      const index = this.row.getIndex(data, id);
      return index > -1
        ? update(data, {
            rows: {
              $apply: (rows: DataGridRowType[]) => {
                rows.splice(index, 0, { id: genKey() });
                return rows;
              },
            },
          })
        : data;
    },
    insertAfter: (data: DataGridValues, id: string): DataGridValues => {
      const index = this.row.getIndex(data, id);
      return index > -1
        ? update(data, {
            rows: {
              $apply: (rows: DataGridRowType[]) => {
                rows.splice(index + 1, 0, { id: genKey() });
                return rows;
              },
            },
          })
        : data;
    },
    remove: (data: DataGridValues, key: string): DataGridValues => {
      const index = this.row.getIndex(data, key);
      return index > -1
        ? update(data, { rows: { $splice: [[index, 1]] } })
        : data;
    },
  };

  /**
   *  ______   ______   __       __  __   __    __   __   __
   * /\  ___\ /\  __ \ /\ \     /\ \/\ \ /\ "-./  \ /\ "-.\ \
   * \ \ \____\ \ \/\ \\ \ \____\ \ \_\ \\ \ \-./\ \\ \ \-.  \
   *  \ \_____\\ \_____\\ \_____\\ \_____\\ \_\ \ \_\\ \_\\"\_\
   *   \/_____/ \/_____/ \/_____/ \/_____/ \/_/  \/_/ \/_/ \/_/
   */
  static readonly column = {
    getIndex: (data: DataGridValues, field: string): number =>
      data.columns.findIndex((col) => col.field === field),
    update: (
      data: DataGridValues,
      field: string,
      column: Partial<GridEnrichedColDef>
    ): DataGridValues => {
      const index = this.column.getIndex(data, field);
      return index > -1
        ? update(data, {
            columns: {
              [index]: {
                $apply: (col: Partial<GridEnrichedColDef>) =>
                  Object.assign({}, col, column),
              },
            },
          })
        : data;
    },
    insertBefore: (
      data: DataGridValues,
      field: string,
      column: Partial<GridEnrichedColDef>
    ): DataGridValues => {
      const index = this.column.getIndex(data, field);
      return index > -1
        ? update(data, {
            columns: {
              $apply: (columns: GridColumns) => {
                columns.splice(index, 0, {
                  ...column,
                  field: genKey(),
                } as GridEnrichedColDef);
                return columns;
              },
            },
          })
        : data;
    },
    insertAfter: (
      data: DataGridValues,
      field: string,
      column: Partial<GridEnrichedColDef>
    ): DataGridValues => {
      const index = this.column.getIndex(data, field);
      return index > -1
        ? update(data, {
            columns: {
              $apply: (columns: GridColumns) => {
                columns.splice(index + 1, 0, {
                  ...column,
                  field: genKey(),
                } as GridEnrichedColDef);
                return columns;
              },
            },
          })
        : data;
    },
    remove: (data: DataGridValues, field: string): DataGridValues => {
      const index = this.column.getIndex(data, field);
      return index > -1
        ? update(data, { columns: { $splice: [[index, 1]] } })
        : data;
    },
  };
}
