import {
  Avatar,
  Box,
  BoxProps,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useMC } from "./ctx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const MCIconProfile = (props: Omit<BoxProps, "children">) => {
  const { user, setState } = useMC();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) =>
    setState((s) => ({ ...s, anchorProfile: event.currentTarget }));

  return (
    <Box {...props}>
      {user.loading ? (
        <IconButton color="inherit" disabled>
          <CircularProgress size={36} color="inherit" />
        </IconButton>
      ) : user.data ? (
        <IconButton edge="end" onClick={handleOpen}>
          <Avatar src={user?.data?.photoURL || undefined} />
        </IconButton>
      ) : (
        <IconButton edge="end" color="inherit" onClick={handleOpen}>
          <FontAwesomeIcon icon={["far", "sign-in"]} />
        </IconButton>
      )}
    </Box>
  );
};
