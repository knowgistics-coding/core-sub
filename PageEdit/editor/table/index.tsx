import {
  DataGridEditor,
  DataGridEditorData,
  DataGridEditorDefaultData,
} from "../../../DataGridEditor";
import { Box } from "@mui/material";
import * as React from "react";
import { usePE } from "../../context";
import { PEPanel } from "../../panel";
import { PEEditorProps } from "../heading";

export const PEEditorTable = ({ content, index }: PEEditorProps) => {
  const {
    state: { hideToolbar },
    data,
    setData,
  } = usePE();

  const handleChange = (value: DataGridEditorData) => {
    setData(data.contentSet(content.key, "table", value));
  };

  React.useEffect(() => {
    if (!Boolean(content.table)) {
      setData(data.contentSet(content.key, "table", DataGridEditorDefaultData));
    }
  }, [data, content.key, content.table, index, setData]);

  return (
    <PEPanel content={content} contentKey={content.key} index={index}>
      <Box mt={2} />
      {content.table && (
        <DataGridEditor
          view={hideToolbar}
          value={content.table}
          onChange={handleChange}
        />
      )}
    </PEPanel>
  );
};
