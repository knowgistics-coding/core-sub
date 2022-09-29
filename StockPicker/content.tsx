import { useCallback, useEffect, useState } from "react";
import { useSP } from "./context";
import { StockDisplay } from "../StockDisplay";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import { StockImageTypes } from "./controller";
import { useCore } from "../context";
import { DragUploadItem } from "./drag.upload";
import update from "react-addons-update";
import { useAlerts } from "../Alerts";
import { useDropzone } from "react-dropzone";
import { grey } from "@mui/material/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CheckBoxContainer = styled(Box)({
  position: "absolute",
  left: 12,
  bottom: 0,
  color: "white",
  "& .MuiSvgIcon-root": {
    fill: "white",
  },
});

const DropHere = styled(Box)<{ isDragActive?: boolean }>(
  ({ theme, isDragActive }) => ({
    cursor: "grab",
    position: "relative",
    backgroundColor: isDragActive ? theme.palette.primary.main : grey[300],
    color: isDragActive ? theme.palette.primary.contrastText : undefined,
    width: "100%",
    "&:hover": {
      backgroundColor: grey[400],
    },
    "&:active": {
      backgroundColor: grey[500],
    },
    "&:after": {
      content: "''",
      display: "block",
      paddingTop: "100%",
    },
    "&>div": {
      position: "absolute",
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  })
);

export const SPContent = () => {
  const { t } = useCore();
  const { addAlert } = useAlerts();
  const { multiple, state, setState, control } = useSP();
  const [progress, setProgress] = useState<{ [key: number]: number }>({});

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (state.uploadqueue.length === 0) {
        const filtered = acceptedFiles.filter((file) =>
          /image/.test(file.type)
        );
        setState((s) => ({
          ...s,
          uploadqueue: filtered,
        }));
        if (filtered.length < acceptedFiles.length) {
          addAlert({
            label: "Some file has not type support",
            severity: "error",
          });
        }
      } else {
        addAlert({
          label: "Please wait until latest queue complete",
          severity: "warning",
        });
      }
    },
    [addAlert, setState, state.uploadqueue.length]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleCheck = (id: string) => () => {
    if (multiple) {
      let selected = state.selected.includes(id)
        ? state.selected.filter((sel) => sel !== id)
        : state.selected.concat(id);
      setState((s) => ({ ...s, selected }));
    } else {
      let selected = state.selected.includes(id) ? [] : [id];
      setState((s) => ({ ...s, selected }));
    }
  };

  useEffect(() => {
    if (control && state.uploadqueue.length > 0) {
      const imageProm = state.uploadqueue.map(async (file, index) => {
        return await control.upload(file, (progress) => {
          setProgress((p) => ({ ...p, [index]: progress }));
        });
      });
      Promise.all(imageProm).then((images) => {
        let i = 0;
        const newData = images.map((image) => {
          let index = state.docs.findIndex((doc) => doc._id === image._id);
          if (index === -1) {
            index = state.docs.length + i;
            i++;
          }
          return { [index]: { $set: image } };
        });
        setState((s) =>
          update(s, {
            docs: Object.assign({}, ...newData),
            uploadqueue: { $set: [] },
          })
        );
        addAlert({ label: t("$Name Successful", { name: t("Upload") }) });
      });
    }
  }, [state.uploadqueue, control, addAlert, setState, state.docs, t]);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <DropHere isDragActive={isDragActive} {...getRootProps()}>
            <div>
              <input accept="image/*" {...getInputProps()} />
              <FontAwesomeIcon icon={["far", "images"]} size="4x" />
              <Typography variant="caption">{t("Drop File Here")}</Typography>
            </div>
          </DropHere>
        </Grid>
        {state.uploadqueue.map((file: File, index) => (
          <DragUploadItem
            progress={progress[index] || -1}
            file={file}
            key={index}
          />
        ))}
        {state.docs
          .sort((a, b) => {
            const getDate = (doc: StockImageTypes) =>
              new Date(doc.datemodified).getTime();
            return getDate(b) - getDate(a);
          })
          .map((doc) => (
            <Grid item xs={6} sm={3} key={doc._id}>
              <StockDisplay image={doc} ratio={1} hover>
                <CheckBoxContainer>
                  <FormControlLabel
                    label={t("Select")}
                    control={
                      <Checkbox
                        size="small"
                        checked={state.selected.includes(doc._id)}
                        onChange={handleCheck(doc._id)}
                      />
                    }
                    componentsProps={{
                      typography: {
                        variant: "body2",
                      },
                    }}
                    sx={{
                      backgroundColor: "#0006",
                      pr: 1.5,
                    }}
                  />
                </CheckBoxContainer>
              </StockDisplay>
            </Grid>
          ))}
      </Grid>
    </div>
  );
};
