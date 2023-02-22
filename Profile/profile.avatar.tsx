import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { alpha, Avatar, Box, IconButton, styled } from "@mui/material";

export const ProfileAvatarContainer = styled(Box)({
  width: 160,
  height: 160,
  position: "absolute",
  bottom: -80,
  left: "calc(50% - 80px)",
})

export const ProfileAvatar = styled(Avatar)({
  border: `solid 4px #FFFFFF`,
  width: 160,
  height: 160,
});

export const UploadIcon = styled((props):JSX.Element => <IconButton {...props}>
  <FontAwesomeIcon icon={["far", "camera"]} />
</IconButton>)(({theme}) => ({
  fontSize: 24,
  backgroundColor:  alpha(theme.palette.background.paper, 0.75),
  "&:hover": {
    backgroundColor:  alpha(theme.palette.background.paper, 1),
  }
}))