import { Box, Button, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { useCore } from "../context";
import { Reaction } from "../Controller/social";
import { PickIcon } from "../PickIcon";

const Root = styled(Box)({});
const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  "& .MuiButton-root": {
    flex: 1,
    padding: theme.spacing(1.5),
  },
}));

export type ReactionBoxProps = {
  doc: string;
};

export const ReactionBox = (props: ReactionBoxProps) => {
  const { t, user } = useCore();
  const [state, setState] = useState<{ reaction: Reaction }>({
    reaction: new Reaction(),
  });

  const handleLike = async () => {
    if (user.data) {
      state.reaction
        .like(user.data, !state.reaction.liked.includes(user.data.uid))
        .then((reaction) => setState((s) => ({ ...s, reaction })));
    }
  };

  useEffect(() => {
    if (props.doc) {
      Reaction.get(props.doc).then((reaction) =>
        setState((s) => ({ ...s, reaction }))
      );
    }
  }, [props.doc]);

  return (
    <Root>
      <Header>
        <Button
          color="neutral"
          startIcon={<PickIcon icon="heart" />}
          onClick={handleLike}
        >
          {state.reaction.liked.length} {t("Like")}
        </Button>
        <Button color="neutral" startIcon={<PickIcon icon="comment" />}>
          {t("Comment")}
        </Button>
      </Header>
    </Root>
  );
};
