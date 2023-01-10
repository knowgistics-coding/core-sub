import {
  Avatar,
  Box,
  BoxProps,
  Skeleton,
  styled,
  Typography,
} from "@mui/material";
import { memo, useEffect, useState } from "react";
import { User } from "../Controller/user";

const Root = styled(Box)(({ onClick }) => ({
  cursor: onClick ? "pointer" : undefined,
}));
const Content = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "#FFF0",
  padding: theme.spacing(1.5),
  margin: theme.spacing(-1.5),
  borderRadius: theme.spacing(3.25),
  transition: "background-color 0.25s ease-in",
  "&:hover": {
    backgroundColor: "#FFF6",
  },
  "&:active": {
    transform: `scale(1.02,1.02)`,
  },
}));

export type CoverUserProps = {
  value?: string;
  onClick?: () => void;
} & Pick<BoxProps, "sx">;

const Loading = () => (
  <>
    <Skeleton variant="circular" sx={{ width: 32, height: 32, mr: 1 }} />
    <Skeleton width={96} />
  </>
);

export const CoverUser = memo((props: CoverUserProps) => {
  const [state, setState] = useState<{
    loading: boolean;
    error?: Error;
    data?: User;
  }>({ loading: true });

  useEffect(() => {
    if (props.value) {
      User.getInfo(props.value)
        .then((data) => {
          setState((s) => ({ ...s, loading: false, data, error: undefined }));
        })
        .catch((error) => {
          setState((s) => ({ ...s, loading: false, data: undefined, error }));
        });
    }
  }, [props.value]);

  return props.value && !Boolean(state.error) ? (
    <Root sx={props.sx} onClick={props.onClick}>
      <Content>
        {state.loading ? (
          <Loading />
        ) : (
          <>
            <Avatar
              src={state.data?.photoURL ?? ""}
              sx={{ mr: 1, width: 32, height: 32 }}
            />
            <Typography variant="body1">{state.data?.displayName}</Typography>
          </>
        )}
      </Content>
    </Root>
  ) : null;
});
