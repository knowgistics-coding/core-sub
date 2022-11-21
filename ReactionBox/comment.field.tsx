import {
  Avatar,
  FormControl,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  OutlinedInput,
  OutlinedInputProps,
} from "@mui/material";
import ActionIcon from "../ActionIcon";
import { useCore } from "../context";
import { Comment } from "../Controller/social";
import { ReplyButton } from "./comment.box";

export type CommentFieldProps = {
  value: OutlinedInputProps["value"];
  onChange: OutlinedInputProps["onChange"];
  onSubmit: () => void;
  inputRef: OutlinedInputProps["inputRef"];
  reply: Comment | null;
  onCencelReply: () => void;
};
export const CommentField = (props: CommentFieldProps) => {
  const { t, user } = useCore();

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={user.data?.photoURL ?? undefined} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <>
            <FormControl fullWidth variant="outlined">
              <OutlinedInput
                autoFocus
                multiline
                inputRef={props.inputRef}
                value={props.value}
                onChange={props.onChange}
                inputProps={{ maxLength: 300 }}
                endAdornment={
                  <InputAdornment position="end">
                    <ActionIcon
                      icon="paper-plane"
                      iconProps={{ size: "lg" }}
                      sx={{ mr: 1 }}
                      onClick={props.onSubmit}
                    />
                  </InputAdornment>
                }
                size="small"
                sx={{ borderRadius: 5 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (e.shiftKey === false) {
                      props.onSubmit();
                    }
                    e.preventDefault();
                  }
                }}
              />
            </FormControl>
          </>
        }
        secondary={
          props.reply && (
            <>
              reply to {props.reply.userInfo?.displayName} -
              <ReplyButton onClick={props.onCencelReply}>
                {t("Cancel")}
              </ReplyButton>
            </>
          )
        }
        primaryTypographyProps={{ component: "div" }}
        secondaryTypographyProps={{ variant: "caption" }}
      />
      {/* <ListItemSecondaryAction sx={{ transform: "none", top: 16 }}>
        <ActionIcon
          icon="paper-plane"
          iconProps={{ size: "lg" }}
          sx={{ mr: 1 }}
          onClick={props.onSubmit}
        />
      </ListItemSecondaryAction> */}
    </ListItem>
  );
};
