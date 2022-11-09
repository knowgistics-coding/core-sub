import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Skeleton,
  styled,
  Typography,
} from "@mui/material";
import { useCore } from "../context";
import { CrossSite } from "../Controller/cross.site";
import { Feeds } from "../Controller/social";
import { DateDisplay } from "../DateDisplay";
import { KuiActionIcon } from "../KuiActionIcon";
import { PickIcon } from "../PickIcon";
import { ReactionBox } from "../ReactionBox";
import { StockDisplay } from "../StockDisplay";

const Root = styled(List)(({ theme }) => ({
  cursor: "pointer",
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  overflow: "hidden",
}));

const Content = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(1, 2),
}));

export type FeedCardProps = {
  loading?: boolean;
  feed?: Feeds;
  itemId?: string;
  title?: string;
  date?: number;
  uid?: string;
};
export const FeedCard = ({ feed, ...props }: FeedCardProps) => {
  const { user } = useCore();

  const handleEdit = async () => {
    if (user.data && feed) {
      const link = await CrossSite.getSignInLink(user.data, 'post', `/post/editor/${feed.id}`);
      if(link){
        window.open(link);
      }
    }
  };

  if (props.loading) {
    return (
      <Root>
        <ListItem>
          <ListItemAvatar>
            <Skeleton variant="circular" sx={{ width: 40, height: 40 }} />
          </ListItemAvatar>
          <ListItemText
            primary={<Skeleton width={"30%"} />}
            secondary={<Skeleton width={"50%"} />}
          />
        </ListItem>
        <Box sx={{ paddingTop: "calc(100% / 4)", position: "relative" }}>
          <Skeleton
            variant="rectangular"
            sx={(theme) => ({ ...theme.mixins.absoluteFluid })}
          />
        </Box>
        <Content>
          <Skeleton width={"50%"} />
        </Content>
      </Root>
    );
  } else if (feed) {
    return (
      <Root>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={feed.userInfo?.photoURL ?? undefined} />
          </ListItemAvatar>
          <ListItemText
            primary={
              feed.userInfo?.displayName ?? feed.userInfo?.email ?? feed.user
            }
            secondary={<DateDisplay date={feed.datecreate} />}
            secondaryTypographyProps={{
              variant: "caption",
              component: "div",
              color: "textSecondary",
            }}
          />
          <ListItemSecondaryAction>
            {user.data?.uid === feed.user && (
              <KuiActionIcon tx="edit" onClick={handleEdit} />
            )}
          </ListItemSecondaryAction>
        </ListItem>
        {feed.feature && <StockDisplay {...feed.feature} ratio={1 / 4} />}
        <Content>
          <Typography variant="h6">
            <PickIcon icon={feed.getIcon()} style={{ marginRight: "1ch" }} />
            {feed.title}
          </Typography>
          {feed.getPreview() && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {feed.getPreview()}
            </Typography>
          )}
        </Content>
        <ReactionBox doc={feed.id} />
      </Root>
    );
  } else {
    return null;
  }
};
