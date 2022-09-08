import { Badge, BadgeProps, styled } from "@mui/material";
import { grey } from "@mui/material/colors";

export interface StatusBadgeProps extends BadgeProps {
  online: boolean;
}

export const StatusBadge = styled(
  (props: BadgeProps) => (
    <Badge
      variant="dot"
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      {...props}
    />
  ),
  {
    shouldForwardProp: (prop) => prop !== "online",
  }
)<StatusBadgeProps>(({ theme, online }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: online ? theme.palette.success.main : grey[400],
    color: online ? theme.palette.success.main : grey[400],
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      ...theme.mixins.absoluteFluid,
      borderRadius: "50%",
      border: "1px solid currentColor",
      content: '""',
    },
  },
}));
