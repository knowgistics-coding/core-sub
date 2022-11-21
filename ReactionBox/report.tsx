import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useEffect, useReducer } from "react";
import { useCore } from "../context";
import { Report } from "../Controller/report";
import { DialogCompact } from "../DialogCompact";
import { KuiButton } from "../KuiButton";

export const ReportDialog = (props: {
  paths?: Report["paths"];
  open: boolean;
  onClose: () => void;
}) => {
  const { t } = useCore();
  const [report, dispatch] = useReducer(
    Report.reducer,
    new Report({ paths: [], selection: [], explaination: "" })
  );

  useEffect(() => {
    if (props.paths) {
      dispatch({ type: "paths", value: props.paths });
    }
  }, [props.paths]);

  return (
    <DialogCompact
      open={props.open}
      icon="flag"
      title={t("Report")}
      onClose={props.onClose}
      actions={<KuiButton tx="confirm" disabled={!report.isComplete()} />}
    >
      {Report.list.map((text) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={report.selection.includes(text)}
              size="small"
              onChange={(_e, checked) =>
                dispatch({ type: "selection", checked, select: text })
              }
            />
          }
          label={text}
          componentsProps={{ typography: { variant: "body2" } }}
          key={text}
          sx={{ display: "block" }}
        />
      ))}
      {report.selection.includes("Something Else") && (
        <TextField
          fullWidth
          multiline
          autoFocus
          rows={3}
          size="small"
          label={t("Description") + " "}
          value={report.explaination}
          onChange={({ target: { value } }) =>
            dispatch({ type: "explaination", value })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          sx={{ mt: 2 }}
        />
      )}
    </DialogCompact>
  );
};
