import {
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { PickIcon } from "../PickIcon";

interface ListButtonProps extends Omit<ListItemButtonProps, "selected"> {
  label: React.ReactNode;
  icon?: React.ReactNode;
  correct?: boolean;
}
export const ListButton = styled(
  ({ label, icon, correct, ...props }: ListButtonProps) => {
    return (
      <ListItemButton {...props} selected={correct}>
        <ListItemIcon>
          {icon ? (
            icon
          ) : (
            <PickIcon icon={correct ? "check-circle" : "xmark-circle"} />
          )}
        </ListItemIcon>
        <ListItemText
          primary={label}
          primaryTypographyProps={{ color: "textSecondary", component: "div" }}
        />
      </ListItemButton>
    );
  }
)<ListButtonProps>(({ theme }) => ({
  border: `solid 1px ${red[300]}`,
  color: red[300],
  borderRadius: theme.shape.borderRadius,
  "& .MuiListItemIcon-root": {
    color: "inherit",
  },
  "& .MuiTypography-root": {
    color: "inherit",
  },
  "&:not(:last-child)": {
    marginBottom: theme.spacing(1),
  },
  "&.Mui-selected": {
    border: `solid 1px ${theme.palette.success.dark}`,
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.success.dark,
    },
  },
}));
