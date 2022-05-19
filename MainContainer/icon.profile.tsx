import {
  Avatar,
  Box,
  BoxProps,
  Button,
  CircularProgress,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import { useMC } from "./ctx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ButtonStyled = styled(Button)({
  borderRadius: 58 / 2,
  padding: "0.5rem 0.75rem",
  boxSizing: "border-box",
  textTransform: "none",
});

const TextWrap = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  "& .MuiTypography-root": {
    lineHeight: 1.1,
  },
});

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
        <ButtonStyled
          startIcon={<Avatar src={user?.data?.photoURL || undefined} />}
          endIcon={<FontAwesomeIcon icon={["fad", "chevron-down"]} />}
          color="neutral"
          onClick={handleOpen}
        >
          <TextWrap>
            <Typography variant="body2" color="textPrimary">
              {user?.data?.displayName}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Personal
            </Typography>
          </TextWrap>
        </ButtonStyled>
      ) : (
        <IconButton edge="end" color="inherit" onClick={handleOpen}>
          <FontAwesomeIcon icon={["fad", "sign-in"]} />
        </IconButton>
      )}
    </Box>
  );
};
