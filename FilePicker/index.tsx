import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAlerts } from "../Alerts";
import { useCore } from "../context";
import { DateCtl, FileCtl } from "../Controller";
import { FileParentList, MekFile } from "../Controller/file";
import { DataGrid } from "../DataGrid";
import { DialogCompact } from "../DialogCompact";
import { Knopf } from "../Knopf";
import { KuiButton } from "../KuiButton";
import { useMC } from "../MainContainer";
import { PickIcon } from "../PickIcon";
import { usePopup } from "../Popup";
import { MekFileIcon } from "./mek.file.icon";

//SECTION - FilePicker
export const FilePicker = () => {
  //SECTION - STATE

  //ANCHOR - useCore
  const { t, user } = useCore();
  const {
    state: { onFilePickerConfirm },
    setState: setMCState,
  } = useMC();

  //ANCHOR - state
  const [state, setState] = useState<{
    loading: boolean;
    parent: string;
    docs: MekFile[];
    parents: FileParentList[];
    selection: string[];
  }>({
    loading: true,
    parent: "0",
    docs: [],
    parents: [],
    selection: [],
  });

  //ANCHOR - Popup
  const { Popup } = usePopup();

  //ANCHOR - addAlert
  const { addAlert } = useAlerts();

  //!SECTION

  //SECTION - HANDLE

  //ANCHOR - isComplete
  const isComplete = (): boolean => {
    if (
      state.selection.length === 1 &&
      state.docs.find((doc) => doc.id === state.selection[0])?.type === "file"
    ) {
      return true;
    }
    return false;
  };

  //ANCHOR - handleAddFolder
  const handleOpenFolder = (id: string) => () => {
    setState((s) => ({ ...s, parent: id }));
  };

  const handleAddFolder = () => {
    Popup.prompt({
      title: t("Create $Name", { name: t("Folder") }),
      text: t("$Name Name", { name: t("Folder") }),
      icon: "plus-circle",
      onConfirm: async (title) => {
        if (user.data && title) {
          MekFile.addFolder(user.data, title, state.parent)
            .then(() => {
              addAlert({ label: t("$Name Added", { name: title }) });
            })
            .catch((err) => {
              addAlert({ label: err.message, severity: "error" });
            });
        }
      },
    });
  };

  //ANCHOR - handleBrowse
  const handleBrowse = async () => {
    const files = await FileCtl.browse();
    if (files.length && user.data) {
      const file = await FileCtl.upload(user.data, files[0]);
      await MekFile.addFile(user.data, file, state.parent);
      addAlert({ label: t("$Name Successful", { name: t("Upload") }) });
    }
  };

  //ANCHOR - handleRemoveSeleceted
  const handleRemoveSeleceted = () => {
    Popup.remove({
      title: t("Remove"),
      text: t("Do You Want To Remove $Name", { name: t("Selected") }),
      icon: "trash",
      onConfirm: async () => {
        await Promise.all(
          state.docs
            .filter((doc) => state.selection.includes(doc.id))
            .map((doc) => doc.remove())
        );
        setState((s) => ({ ...s, selection: [] }));
        addAlert({ label: t("Removed") });
      },
    });
  };

  //ANCHOR - handleConfirm
  const handleConfirm = () => {
    if (isComplete() && onFilePickerConfirm) {
      const file = state.docs.find((doc) => doc.id === state.selection[0]);
      if (file) {
        onFilePickerConfirm(file);
        setState((s) => ({ ...s, selection: [] }));
        handleClose();
      }
    }
  };

  //ANCHOR - handleClose
  const handleClose = () => {
    setMCState((s) => ({ ...s, onFilePickerConfirm: null }));
  };

  //!SECTION

  //SECTION - useEffect
  useEffect(() => {
    if (user.loading === false && user.data) {
      return MekFile.watchMany(
        user.data,
        (docs, parents) => {
          setState((s) => ({ ...s, docs, loading: false, parents }));
        },
        state.parent
      );
    }
  }, [user, state.parent]);
  //!SECTION

  //SECTION - render
  return (
    <DialogCompact
      open={Boolean(onFilePickerConfirm)}
      title={t("Select $Name", { name: t("File") })}
      icon="file-alt"
      maxWidth="sm"
      onClose={handleClose}
      actions={
        <>
          <Knopf
            icon="upload"
            color="info"
            onClick={handleBrowse}
          >
            {t("Upload")}
          </Knopf>
          <Knopf icon="folder-plus" color="info" onClick={handleAddFolder}>
            {t("Create $Name", { name: t("Folder") })}
          </Knopf>
          {state.selection.length > 0 && (
            <Knopf icon="trash" color="error" onClick={handleRemoveSeleceted}>
              {t("Remove $Name", { name: t("Selected") })}
            </Knopf>
          )}
          <Box flex={1} />
          <KuiButton
            tx="confirm"
            disabled={!isComplete()}
            onClick={handleConfirm}
          />
        </>
      }
    >
      <Breadcrumbs
        sx={{
          mb: 2,
          "& .MuiBreadcrumbs-li": {
            cursor: "pointer",
            lineHeight: 1,
          },
        }}
        separator={<PickIcon icon="chevron-right" />}
      >
        {state.parents
          .concat({ title: "Root", keyId: "0" })
          .reverse()
          .map((item, index, items) =>
            index === items.length - 1 ? (
              <Typography variant="caption" key={item.keyId}>
                {item.title}
              </Typography>
            ) : (
              <Link
                variant="caption"
                key={item.keyId}
                onClick={handleOpenFolder(item.keyId)}
              >
                {item.title}
              </Link>
            )
          )}
      </Breadcrumbs>
      <DataGrid
        initialState={{
          sorting: { sortModel: [{ field: "title", sort: "asc" }] },
        }}
        loading={state.loading}
        rows={state.docs}
        columns={[
          {
            field: "icon",
            headerName: " ",
            renderCell: ({ row }) => (
              <Typography variant="body1" sx={{ color: "info.main" }}>
                <MekFileIcon file={row} />
              </Typography>
            ),
            align: "center",
            width: 48,
            sortable: false,
            disableColumnMenu: true,
          },
          {
            field: "title",
            headerName: t("Title"),
            valueGetter: ({ row }) => row.getTitle(),
            renderCell: ({ row, value }) => (
              <Stack direction="row" spacing={1}>
                {row.type === "folder" ? (
                  <Button
                    onClick={handleOpenFolder(row.id)}
                    sx={{ textTransform: "none" }}
                  >
                    {value}
                  </Button>
                ) : (
                  <Typography variant="inherit">{value}</Typography>
                )}
              </Stack>
            ),
            width: 240,
          },
          {
            field: "datemodified",
            headerName: t("Date"),
            renderCell: ({ value }) => DateCtl.toDateString(value),
            width: 160,
          },
        ]}
        checkboxSelection
        onSelectionModelChange={(selection) =>
          setState((s) => ({
            ...s,
            selection: selection.map((id) => id.toString()),
          }))
        }
        autoHeight={false}
        height={480}
      />
    </DialogCompact>
  );
  //!SECTION
};
//!SECTION
