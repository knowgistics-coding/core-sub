import { BoxProps } from "@mui/material";
import { GridColumns } from "@mui/x-data-grid";
import * as React from "react";
import { genKey } from "./gen.key";

export interface DataGridEditorData {
  rows: { [key: string]: string; id: string }[];
  columns: GridColumns;
}

export const DataGridEditorDefaultData: DataGridEditorData = {
  rows: [{ id: genKey() }, { id: genKey() }],
  columns: [
    { field: genKey(), headerName: "Column 1", width: 160 },
    { field: genKey(), headerName: "Column 2", width: 160 },
  ],
};

export interface DataGridEditorProps {
  value?: DataGridEditorData;
  onChange?: (data: DataGridEditorData) => void;
  view?: boolean
  componentProps?: {
    rootProps?: BoxProps;
  };
}

export interface DataGridEditorContextTypes
  extends Pick<DataGridEditorProps, "onChange"> {
  data: DataGridEditorData;
  setData: React.Dispatch<React.SetStateAction<DataGridEditorData>>;
}
export const DataGridEditorContext =
  React.createContext<DataGridEditorContextTypes>({
    data: DataGridEditorDefaultData,
    setData: () => {},
  });

export const useDGE = () => React.useContext(DataGridEditorContext);
