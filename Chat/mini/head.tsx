import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useCore } from "components/core-sub/context";
import { UserLists } from "components/core-sub/Controller";

export const ChatHead = (props: { users: UserLists; onClose: () => void }) => {
  const { user } = useCore();
  const usersArray = Object.keys(props.users)
    .map((key) => ({ ...props.users[key], uid: key }))
    .filter((u) => u.uid !== user.data?.uid);

  return (
    <Box px={2} py={1}>
      <Stack direction={"row"} alignItems="center">
        <Box flex={1}>
          {usersArray.length > 1 ? (
            <AvatarGroup>
              {usersArray.map((user) => (
                <Avatar
                  alt={user.displayName}
                  src={user.photoURL || undefined}
                  key={user.uid}
                />
              ))}
            </AvatarGroup>
          ) : (
            <Typography>{usersArray[0]?.displayName}</Typography>
          )}
        </Box>
        <Box flex={1} />
        <IconButton edge="end" onClick={props.onClose}>
          <FontAwesomeIcon icon={["far", "xmark"]} />
        </IconButton>
      </Stack>
    </Box>
  );
};
