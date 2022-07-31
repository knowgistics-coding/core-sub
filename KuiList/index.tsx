import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListProps,
  Skeleton,
} from "@mui/material";
import { useCore } from "../context";

export interface KuiListProps extends ListProps {
  divider?: boolean;
  length?: number;
  loading?: boolean;
}
export const KuiList = ({
  divider,
  children,
  length,
  loading,
  ...props
}: KuiListProps) => {
  const { t } = useCore();
  return (
    <List {...props}>
      {divider && <Divider />}
      {loading ? (
        <ListItem divider={divider}>
          <ListItemText
            primary={<Skeleton width="50%" />}
            secondary={<Skeleton width="35%" height={16} />}
          />
        </ListItem>
      ) : Boolean(length) === false ? (
        <ListItem divider={divider}>
          <ListItemText
            primary={t("No Data")}
            primaryTypographyProps={{
              color: "textSecondary",
              variant: "body2",
            }}
          />
        </ListItem>
      ) : (
        children
      )}
    </List>
  );
};
