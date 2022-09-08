import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  AppBar,
  Box,
  Breakpoint,
  Button,
  CircularProgress,
  IconButton,
  Skeleton,
  Toolbar,
} from "@mui/material";
import { Container } from "../Container";
import { ContentHeader } from "../ContentHeader";

export type LoadingProps = {
  maxWidth?: Breakpoint;
};
export const Loading = (props: LoadingProps) => {
  return (
    <>
      <AppBar
        elevation={0}
        sx={(theme) => ({
          backgroundColor: "background.paper",
          borderBottom: `solid 1px ${theme.palette.divider}`,
        })}
      >
        <Toolbar>
          <Box flex={1} />
          <IconButton edge="end">
            <CircularProgress size={30} color="inherit" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box py={6}>
        <Container maxWidth={props.maxWidth || "md"}>
          <ContentHeader
            breadcrumbs={[
              { label: "", component: <Skeleton width={64} /> },
              { label: "", component: <Skeleton width={64} /> },
            ]}
            label={<Skeleton width={"50%"} height={72} />}
            actions={
              <Button
                variant="outlined"
                disabled
                startIcon={<FontAwesomeIcon icon={["far", "spinner"]} pulse />}
              >
                <Skeleton width={64} />
              </Button>
            }
          />
          <Skeleton width={"75%"} />
          <Skeleton width={"50%"} sx={{ mb: 2 }} />
          <Skeleton width={"75%"} />
          <Skeleton width={"50%"} />
        </Container>
      </Box>
    </>
  );
};
