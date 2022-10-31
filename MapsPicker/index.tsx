import { Box, Link } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useCore } from "../context";
import { Map } from "../Controller/map";
import { DataGrid } from "../DataGrid";
import { DialogCompact } from "../DialogCompact";
import { KuiButton } from "../KuiButton";

export type MapsPickerProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (docs: Map[]) => void;
};

export const MapsPicker = (props: MapsPickerProps) => {
  const { t, user } = useCore();
  const [state, setState] = useState<{
    loading: boolean;
    docs: Map[];
    selection: string[];
  }>({
    loading: true,
    docs: [],
    selection: [],
  });

  useEffect(() => {
    if (user.loading === false && props.open) {
      if (user.data) {
        return Map.watchMy(
          user.data,
          (docs) => {
            setState((s) => ({ ...s, loading: false, docs }));
          },
          undefined,
          ["public"]
        );
      } else {
        setState((s) => ({ ...s, loading: false, docs: [] }));
      }
    } else {
      setState((s) => ({ ...s, loading: true, docs: [] }));
    }
  }, [user, props.open]);

  const handleConfirm = () => {
    if (state.selection.length > 0) {
      const selectedDocs = state.selection
        .map((id) => state.docs.find((doc) => doc.id === id))
        .filter((doc): doc is Map => !!doc);
      props.onConfirm(selectedDocs);
    }
  };

  return (
    <>
      <DialogCompact
        maxWidth="sm"
        open={props.open}
        icon="map-marker-alt"
        title="Map Picker"
        actions={
          <>
            <Link
              href="https://maps.mek.network"
              target="_blank"
              sx={{ textDecoration: "none" }}
            >
              <KuiButton tx="add" />
            </Link>
            <Box flex={1} />
            <KuiButton
              tx="confirm"
              disabled={state.selection.length === 0}
              onClick={handleConfirm}
            />
          </>
        }
        componentProps={{ dialogActions: { sx: { pl: 3 } } }}
        onClose={props.onClose}
      >
        <DataGrid
          initialState={{
            sorting: { sortModel: [{ field: "title", sort: "asc" }] },
          }}
          searchable
          loading={state.loading}
          rows={state.docs}
          columns={[
            { field: "title", headerName: t("Title"), width: 240 },
            {
              field: "type",
              headerName: t("Type"),
              valueGetter: ({ row }) => row.properType(),
              width: 120,
            },
            {
              field: "datemodified",
              headerName: t("Date"),
              renderCell: ({ value }) =>
                moment(value).format("YYYY/MM/DD HH:mm"),
              width: 180,
            },
          ]}
          checkboxSelection
          selectionModel={state.selection}
          onSelectionModelChange={(selection) =>
            setState((s) => ({
              ...s,
              selection: selection.map((s) => String(s)),
            }))
          }
        />
      </DialogCompact>
    </>
  );
};
