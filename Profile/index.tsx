import { IconName, IconPack, library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Stack, Typography } from "@mui/material";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../Container";
import { useCore } from "../context";
import { ProfileValue } from "../Controller/profile";
import { PageContent } from "../PageContent";
import { StockDisplay } from "../StockDisplay";
import { FollowBox } from "./follow.box";
import { ArchChip, ProfileArchs } from "./profile.archs";
import { ProfileAvatar, ProfileAvatarContainer } from "./profile.avatar";
import { ProfileButton } from "./profile.button";
import { ProfileContainer } from "./profile.container";
import { ProfileRoot } from "./profile.root";

library.add(far as IconPack);

export type ProfileProps = {
  value?: ProfileValue;
  onFollow: (uid: string, value: boolean) => void;
};

export const Profile = (props: ProfileProps) => {
  const { t, isMobile, user } = useCore();
  const nav = useNavigate();

  const handleEdit = () => nav(`/profile/edit`);
  const handleFollow = (value: boolean) => () => {
    if (props.value?.uid) {
      props.onFollow(props.value?.uid, value);
    }
  };

  const isFollow = useCallback((): boolean => {
    return (
      (props.value?.followers.findIndex((f) => f.user === user.data?.uid) ??
        0) > -1
    );
  }, [props.value, user.data]);

  return (
    <Box pb={6}>
      <ProfileRoot>
        <StockDisplay
          ratio={isMobile ? 0.5 : 0.25}
          {...props.value?.feature}
          size="large"
        />
        <ProfileAvatarContainer>
          <ProfileAvatar src={props.value?.photoURL ?? undefined} />
        </ProfileAvatarContainer>
      </ProfileRoot>
      <ProfileContainer>
        <Stack spacing={2}>
          <Typography variant="h6" textAlign="center">
            {props.value?.displayName ?? ""}
          </Typography>
          {user.loading ? (
            <ProfileButton.Loading t={t} />
          ) : user.data?.uid === props.value?.uid ? (
            <ProfileButton.Edit t={t} onClick={handleEdit} />
          ) : isFollow() ? (
            <ProfileButton.Unfollow t={t} onClick={handleFollow(false)} />
          ) : (
            <ProfileButton.Follow t={t} onClick={handleFollow(true)} />
          )}
          <FollowBox borders profile={props.value} />
        </Stack>
      </ProfileContainer>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {(props.value?.achievements.length ?? 0) > 0 && (
          <ProfileArchs>
            {props.value?.achievements.map((item, index) => (
              <ArchChip
                key={index}
                label={`${item.label} (${item.from})`}
                icon={<FontAwesomeIcon icon={["far", item.icon as IconName]} />}
              />
            ))}
          </ProfileArchs>
        )}
      </Container>
      <PageContent data={props.value?.getContents()} />
    </Box>
  );
};
