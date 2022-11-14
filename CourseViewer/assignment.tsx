import {
  Box,
  Container,
  Typography,
  Skeleton,
  Paper,
  Button,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import { useState } from "react";
import { MaterialDocument } from ".";
import { Absatz } from "../Absatz";
import { Breadcrumb, ContentHeader } from "../ContentHeader";
import { TFunction, useCore } from "../context";
import { FileCtl } from "../Controller";
import { DateDisplay } from "../DateDisplay";
import { FileChip } from "../FileChip";
import { SpliceImmutable } from "../func";
import { KuiActionIcon } from "../KuiActionIcon";
import { KuiButton } from "../KuiButton";
import { KuiList } from "../KuiList";
import { PickIcon } from "../PickIcon";

export class AssignmentCtl {
  static isLated(
    duedate: string,
    timezone?: string,
    current?: number
  ): boolean {
    const due = new Date(`${duedate}:00.000${timezone || "+07:00"}`).getTime();
    const now = current || new Date().getTime();
    return due < now;
  }
  static dueDisplay(t: TFunction, duedate: string, timezone?: string): string {
    const due = new Date(`${duedate}:00.000${timezone || "+07:00"}`).getTime();
    return (
      moment(due).format("LLL") +
      (this.isLated(duedate, timezone) ? ` - ${t("Lated")}` : "")
    );
  }
}

export type AssignmentSubmitRawDataType = { content: string; files: File[] };
export type AssignmentSubmitDocument = {
  id: string;
  files: { name: string; url: string }[];
  parent: string;
  content: string;
  date: Timestamp;
  user: string;
  studentId: string;
  score?: number;
};

export interface CourseAssignmentProps {
  assignmentId: string;
  breadcrumbs?: Breadcrumb[];
  item: MaterialDocument;
  submit: {
    loading: boolean;
    data: null | AssignmentSubmitDocument;
  };
  onSend: (data: AssignmentSubmitRawDataType) => void;
  onUnsend: (id: string) => void;
}

export const CourseAssignment = ({
  item,
  submit,
  ...props
}: CourseAssignmentProps) => {
  const { t } = useCore();
  const [data, setData] = useState<{ content?: string; files: File[] }>({
    files: [],
  });

  const isComplete = (): boolean => Boolean(data.content);
  const handleSend = () => {
    if (data.content) {
      props.onSend({ content: data.content, files: data.files });
    }
  };

  return (
    <Box py={6}>
      <Container maxWidth="post">
        <ContentHeader
          label={item.title}
          breadcrumbs={props.breadcrumbs}
          secondary={<DateDisplay date={item.datemodified} />}
        />
        <Absatz noDense view value={item.content} />
        {item.files?.length && (
          <Box sx={{ mt: 2 }}>
            {item.files?.map((file, index) => (
              <FileChip {...file} sx={{ mr: 1, mb: 1 }} key={index} />
            ))}
          </Box>
        )}
        {item.datedue && (
          <Typography
            variant="body1"
            component="div"
            sx={{
              color: AssignmentCtl.isLated(
                item.datedue,
                item.schedule?.timezone
              )
                ? "error.main"
                : "success.main",
            }}
          >
            {t("Due Date")}&nbsp;:&nbsp;
            {AssignmentCtl.dueDisplay(t, item.datedue, item.schedule?.timezone)}
          </Typography>
        )}
        {submit.loading ? (
          <Box pt={6}>
            <Skeleton width={"50%"} />
            <Skeleton width={"35%"} height={16} />
          </Box>
        ) : submit.data ? (
          <Box mt={6}>
            <Typography variant="h6" sx={{ pb: 2 }}>
              {t("Answer")}
            </Typography>
            <Paper sx={{ p: 2, pt: 0 }}>
              <Absatz view value={submit.data.content} noDense />
              {Boolean(submit.data.files.length) &&
                submit.data.files.map((file, index) => (
                  <FileChip {...file} key={index} sx={{ mb: 1, mr: 1 }} />
                ))}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems={"center"}
              >
                <Typography
                  variant="caption"
                  color={
                    item.datedue &&
                    AssignmentCtl.isLated(
                      item.datedue,
                      item.schedule?.timezone,
                      submit.data.date?.toMillis() || Date.now()
                    )
                      ? "error"
                      : "textSecondary"
                  }
                >
                  {moment(submit.data.date?.toMillis() || Date.now()).format(
                    "LLL"
                  )}
                  {item.datedue &&
                  AssignmentCtl.isLated(
                    item.datedue,
                    item.schedule?.timezone,
                    submit.data.date?.toMillis() || Date.now()
                  )
                    ? ` - ${t("Lated")}`
                    : ""}
                </Typography>
                {submit.data.score !== undefined ? (
                  <Typography fontWeight={"bold"}>
                    {t("Score")} = {submit.data.score}
                  </Typography>
                ) : (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<PickIcon icon={"xmark"} />}
                    color="error"
                    onClick={() => props.onUnsend(submit.data!.id)}
                  >
                    {t("Unsubmit")}
                  </Button>
                )}
              </Box>
            </Paper>
          </Box>
        ) : (
          <Box pt={6}>
            <Typography variant="h6" sx={{ pb: 2 }}>
              {t("Answer")}
            </Typography>
            <Absatz
              value={data.content}
              onChange={(content) => setData((d) => ({ ...d, content }))}
              noDense
            />
            <Box sx={{ mt: 2 }}>
              <KuiButton
                tx="browse"
                onClick={() =>
                  FileCtl.browse(undefined, true).then((files) => {
                    setData((s) => ({ ...s, files: s.files.concat(...files) }));
                  })
                }
              />
            </Box>
            <KuiList dense length={data.files.length} divider sx={{ my: 2 }}>
              {data.files.map((file, index) => (
                <ListItem divider key={index}>
                  <ListItemText primary={file.name} />
                  <ListItemSecondaryAction>
                    <KuiActionIcon
                      tx="remove"
                      onClick={() =>
                        setData((d) => ({
                          ...d,
                          files: SpliceImmutable(d.files, index, 1),
                        }))
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </KuiList>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="outlined"
                color="success"
                startIcon={<PickIcon icon={"paper-plane"} />}
                onClick={handleSend}
                disabled={!isComplete()}
              >
                {t("Submit")}
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};
