import {
  DataGridEditor,
  DataGridEditorData,
  DataGridEditorDefaultData,
} from "../../../DataGridEditor";
import { Box } from "@mui/material";
import * as React from "react";
import update from "react-addons-update";
import { usePE } from "../../context";
import { PEPanel } from "../../panel";
import { PEEditorProps } from "../heading";

export const PEEditorTable = ({ content, index }: PEEditorProps) => {
  const { state:{hideToolbar}, setData } = usePE();

  const handleChange = (data: DataGridEditorData) => {
    setData((d) =>
      update(d, { contents: { [index]: { table: { $set: data } } } })
    );
  };

  React.useEffect(() => {
    if (!Boolean(content.table)) {
      setData((d) =>
        update(d, {
          contents: { [index]: { table: { $set: DataGridEditorDefaultData } } },
        })
      );
      console.log(content.table);
    }
  }, [content.table, index, setData]);

  return (
    <PEPanel content={content} contentKey={content.key} index={index}>
      <Box mt={2} />
      {content.table && (
        <DataGridEditor view={hideToolbar} value={content.table} onChange={handleChange} />
      )}
    </PEPanel>
  );
};
