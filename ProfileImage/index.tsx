import { useState } from "react";
import {
  Avatar,
  AvatarProps,
  Box,
  IconButton,
  IconButtonProps,
  styled,
} from "@mui/material";
import { StockImageTypes, StockPicker } from "../StockPicker";
import { PickIcon } from "../PickIcon";

const Root = styled(Box)({
  position: "relative",
  display: "inline-block",
});

const CameraIcon = styled((props) => (
  <IconButton size="small" {...props}>
    <PickIcon icon={"camera"} />
  </IconButton>
))<IconButtonProps>({
  position: "absolute",
  bottom: 0,
  right: 0,
  backgroundColor: "rgba(255,255,255,0.5)",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.75)",
  },
});

const AvatarStyled = styled(Avatar)({ width: 128, height: 128 });

interface ProfileImageProps {
  src?: AvatarProps["src"];
  onChange?: (images: StockImageTypes[]) => void;
}
export const ProfileImage = ({ src, onChange }: ProfileImageProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleConfirm = (images: StockImageTypes[]) => {
    setOpen(false);
    onChange?.(images);
  };

  return (
    <Root>
      <AvatarStyled src={src} />
      <CameraIcon onClick={() => setOpen(true)} />
      <StockPicker
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
      />
    </Root>
  );
};
