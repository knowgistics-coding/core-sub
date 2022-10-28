import {
  Box,
  BoxProps,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import React, { MouseEventHandler } from "react";
import { useCore } from "../context";
import { PickIcon } from "../PickIcon";

type PosType = { top: string; left: string };

const Root = styled(Box)<{ disabled?: boolean }>(({ theme, disabled }) => ({
  position: "relative",
  backgroundColor: disabled ? undefined : theme.palette.background.paper,
  border: `solid 1px ${theme.palette.divider}`,
  boxSizing: "border-box",
  paddingTop: "100%",
  borderRadius: theme.spacing(2),
  overflow: "hidden",
}));

const Absolute = styled(Box)(({ theme }) => ({
  ...theme.mixins.absoluteFluid,
  display: "flex",
  flexDirection: "column",
}));

const ContentBox = styled(Box)(({ theme }) => ({
  position: "relative",
  flex: 1,
  "& .inner-content": {
    ...theme.mixins.absoluteFluid,
    padding: theme.spacing(2),
    overflow: "hidden",
  },
}));

const FeatureBox = styled(Box)<{
  src: string;
  pos?: PosType;
}>(({ src, pos }) => ({
  backgroundSize: "cover",
  backgroundPosition:
    pos?.top && pos?.left ? `${pos.left} ${pos.top}` : undefined,
  backgroundImage: `url("${src}")`,
  paddingTop: "calc(100% / 3)",
}));

const ActionsBox = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(0, 2, 1),
}));
ActionsBox.defaultProps = {
  justifyContent: "flex-end",
  spacing: 1,
  direction: "row",
};

const EllipsisBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  textAlign: "right",
  top: 0,
  right: 0,
  width: 64,
  height: 64,
  padding: theme.spacing(1, 0.5, 0.5),
  color: "white",
  filter: "drop-shadow(0 0 8px rgba(0,0,0,1))",
}));

const LoadingBox = styled((props: BoxProps) => (
  <Box {...props}>
    {props.children || <CircularProgress size={64} color="inherit" />}
  </Box>
))<{ children?: React.ReactNode }>(({ theme }) => ({
  ...theme.mixins.absoluteFluid,
  color: theme.palette.divider,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

export type KarteProps = {
  loading?: boolean;
  empty?: boolean;
  feature?: string;
  pos?: PosType;
  title?: React.ReactNode;
  description?: React.ReactNode;
  content?: React.ReactNode;
  actions?: React.ReactNode;
  onMenu?: MouseEventHandler<HTMLButtonElement>;
  ellipsis?: React.ReactNode;
};
export const Karte = (props: KarteProps) => {
  const { t } = useCore();
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Root disabled={props.empty}>
        {props.empty ? (
          <LoadingBox>{t("No Data")}</LoadingBox>
        ) : props.loading ? (
          <LoadingBox />
        ) : (
          <Absolute>
            {props.feature && (
              <FeatureBox src={props.feature} pos={props.pos} />
            )}
            <ContentBox>
              <Box className="inner-content">
                <Typography variant="h6">{props.title}</Typography>
                {props.description && (
                  <Typography variant="caption" color="textSecondary">
                    {props.description}
                  </Typography>
                )}
                {props.content && (
                  <Typography variant="body2" mt={2} component="div">
                    {props.content}
                  </Typography>
                )}
              </Box>
            </ContentBox>
            {props.actions && <ActionsBox>{props.actions}</ActionsBox>}
            {props.onMenu && (
              <EllipsisBox>
                <IconButton
                  edge="end"
                  color="inherit"
                  size="small"
                  onClick={props.onMenu}
                  sx={{ height: 36, width: 36 }}
                >
                  <PickIcon icon={"ellipsis-v"} size="lg" />
                </IconButton>
              </EllipsisBox>
            )}
          </Absolute>
        )}
      </Root>
    </Grid>
  );
};
