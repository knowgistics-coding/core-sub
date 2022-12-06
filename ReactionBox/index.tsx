import { Box, Button, List, styled } from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useCore } from "../context";
import { Comment, Feeds, Reaction } from "../Controller/social";
import { PickIcon } from "../PickIcon";
import { usePopup } from "../Popup";
import { CommentBox } from "./comment.box";
import { CommentField } from "./comment.field";
import { MenuItem, MoreMenu, MoreMenuProps } from "./more.menu";
import { ReportDialog } from "./report";

const Root = styled(Box)({});
const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  "& .MuiButton-root": {
    flex: 1,
    padding: theme.spacing(1.5),
  },
}));
const CommentSection = styled(Box)({});

export type ReactionBoxProps = {
  userId: string;
  doc: string;
  type: Feeds["type"];
  commenting?: boolean;
  onCommenting?: () => void;
};

export const ReactionBox = (props: ReactionBoxProps) => {
  const { t, user } = useCore();
  const [state, setState] = useState<{
    report: boolean;
    reaction: Reaction;
    comments: Comment[];
    comment: string;
    reply: null | Comment;
    more: MoreMenuProps["data"];
  }>({
    report: false,
    reaction: new Reaction(),
    comments: [],
    comment: "",
    reply: null,
    more: null,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const { Popup } = usePopup();

  const handleLike = async () => {
    if (user.data) {
      state.reaction
        .like(user.data, props.userId, props.type)
        .then((reaction) => setState((s) => ({ ...s, reaction })));
    }
  };
  const handleChangeComment = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setState((s) => ({ ...s, comment: value }));
  };
  const handleSubmitComment = async () => {
    if (user.data && state.comment) {
      await Comment.submit(
        state.reaction,
        user.data,
        state.comment,
        state.reply?.id
      );
      setState((s) => ({ ...s, comment: "", reply: null }));
    }
  };
  const handleReply = (reply: Comment | null) => () => {
    setState((s) => ({ ...s, reply }));
    if (reply !== null) {
      inputRef.current?.focus();
    }
  };
  const handleRemove = () => {
    Popup.remove({
      title: t("Remove"),
      text: t("Do You Want To Remove $Name", { name: t("Comment") }),
      icon: "trash",
      onConfirm: async () => {
        if (state.more?.comment) {
          await state.more.comment.remove();
          setState((s) => ({ ...s, more: null }));
        }
      },
    });
  };

  useEffect(() => {
    if (user.loading === false && user.data && props.doc) {
      Reaction.get(props.doc).then((reaction) =>
        setState((s) => ({ ...s, reaction }))
      );
      if (props.commenting) {
        return Comment.watch(user.data, props.doc, (comments) =>
          setState((s) => ({ ...s, comments }))
        );
      }
    }
  }, [user, props.doc, props.commenting]);

  return (
    <Root>
      <Header>
        <Button
          color={state.reaction.isLiked(user.data) ? "primary" : "neutral"}
          startIcon={<PickIcon icon="heart" />}
          onClick={handleLike}
        >
          {state.reaction.liked.length} {t("Like")}
        </Button>
        <Button
          color="neutral"
          startIcon={<PickIcon icon="comment" />}
          onClick={props.onCommenting}
        >
          {t("Comment")}
        </Button>
      </Header>
      {user.data && props.commenting && (
        <CommentSection>
          <List>
            <CommentField
              value={state.comment}
              onChange={handleChangeComment}
              inputRef={inputRef}
              onSubmit={handleSubmitComment}
              reply={state.reply}
              onCencelReply={handleReply(null)}
            />
            {state.comments
              .filter((c) => c.parent === "")
              .sort((a, b) => b.datecreate - a.datecreate)
              .map((comment) => (
                <CommentBox
                  comment={comment}
                  onReply={handleReply(comment)}
                  onClickMore={(elem, comment) =>
                    setState((s) => ({ ...s, more: { elem, comment } }))
                  }
                  key={comment.id}
                >
                  {state.comments
                    .filter((c) => c.parent === comment.id)
                    .sort((a, b) => a.datecreate - b.datemodified)
                    .map((subcomment) => (
                      <CommentBox
                        comment={subcomment}
                        onClickMore={(elem, comment) =>
                          setState((s) => ({ ...s, more: { elem, comment } }))
                        }
                        key={subcomment.id}
                      />
                    ))}
                </CommentBox>
              ))}
          </List>
        </CommentSection>
      )}
      {user.data && (
        <MoreMenu
          data={state.more}
          onClose={() => setState((s) => ({ ...s, more: null }))}
        >
          <List>
            {user.data.uid === state.more?.comment.user ? (
              <>
                <MenuItem
                  icon="trash"
                  primary={t("Remove")}
                  onClick={handleRemove}
                />
              </>
            ) : (
              <>
                <MenuItem
                  icon="flag"
                  primary={t("Report")}
                  onClick={() => setState((s) => ({ ...s, report: true }))}
                />
              </>
            )}
          </List>
        </MoreMenu>
      )}
      <ReportDialog
        open={state.report}
        onClose={() => setState((s) => ({ ...s, report: false }))}
        paths={[props.doc, state.more?.comment.id ?? ""]}
      />
    </Root>
  );
};
