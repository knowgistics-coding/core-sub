import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useCore } from "../context";
import { DataGrid } from "../DataGrid";
import { KuiButton } from "../KuiButton";
import { PageContentTypes } from "../PageEdit";
import { StockDisplayProps } from "../StockDisplay";
import { BookEditCtl } from "./ctl";
import moment from "moment";
import { GridSelectionModel } from "@mui/x-data-grid";

export type PostSchedule = {
  start: string;
  end: string;
  timezone: string;
};

export interface PostDocument {
  user: string;
  title: string;
  datecreate: Timestamp | Date | number;
  datemodified: Timestamp | Date | number;
  feature?: StockDisplayProps;
  type: "post";
  visibility?: string;
  id: string;
  desc?: string;
  schedule?: PostSchedule;
  contents?: PageContentTypes[];
}

export type PostAddType = {
  open: boolean;
  onClose: () => void;
  onAddPost: (selection: PostDocument[]) => void;
};

export const PostAdd = (props: PostAddType) => {
  const { user, t } = useCore();
  const [post, setPost] = useState<{
    loading: boolean;
    docs: PostDocument[];
  }>({
    loading: true,
    docs: [],
  });
  const [state, setState] = useState<{
    selection: string[];
  }>({
    selection: [],
  });

  const handleChangeSelection = (selection: GridSelectionModel) => {
    if (Array.isArray(selection)) {
      setState((s) => ({ ...s, selection: selection as string[] }));
    }
  };

  const handleAddPost = () => {
    props.onAddPost(
      post.docs.filter((doc) => state.selection.includes(doc.id))
    );
    setState((s) => ({ ...s, selection: [] }));
  };

  useEffect(() => {
    if (user.loading === false) {
      if (user.data) {
        return BookEditCtl.post.many((docs) => {
          setPost({ loading: false, docs });
        });
      } else {
        setPost({ loading: false, docs: [] });
      }
    } else {
      setPost({ loading: true, docs: [] });
    }
    return () => {};
  }, [user, t]);

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={props.open} onClose={props.onClose}>
        <DialogTitle>{t("Add $Name", { name: t("POST") })}</DialogTitle>
        <DialogContent>
          <DataGrid
            searchable
            initialState={{
              pagination: {
                pageSize: 10,
              },
            }}
            loading={post.loading}
            rows={post.docs}
            columns={[
              {
                field: "title",
                headerName: t("Title"),
                renderCell: ({ row, value }) => value || row.title,
                width: 280,
              },
              {
                field: "datemodified",
                headerName: t("Date"),
                valueGetter: ({ value }) => value?.toMillis?.() || Date.now(),
                renderCell: ({ value }) => moment(value).format("l LT"),
                width: 180,
              },
            ]}
            checkboxSelection
            selectionModel={state.selection}
            onSelectionModelChange={handleChangeSelection}
            disableSelectionOnClick={false}
          />
        </DialogContent>
        <DialogActions>
          <KuiButton
            tx="confirm"
            disabled={state.selection.length === 0}
            onClick={handleAddPost}
          />
          <KuiButton tx="close" onClick={props.onClose} />
        </DialogActions>
      </Dialog>
    </>
  );
};
