import { Box, styled, Typography } from "@mui/material";

const Container = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: theme.zIndex.appBar + 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-end",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  padding: theme.spacing(0, 3),
}));

const Root = styled(Box)(({ theme }) => ({
  display: "inline-block",
  position: "relative",
  width: 80,
  height: 80,
  "--time": "1s",
  "& div": {
    position: "absolute",
    top: 33,
    width: 13,
    height: 13,
    borderRadius: "50%",
    background: "currentColor",
    animationTimingFunction: "cubic-bezier(0, 1, 1, 0)",
  },
  "& div:nth-of-type(1)": {
    left: 8,
    animation: "lds-ellipsis1 var(--time) infinite",
  },
  "& div:nth-of-type(2)": {
    left: 8,
    animation: "lds-ellipsis2 var(--time) infinite",
  },
  "& div:nth-of-type(3)": {
    left: 32,
    animation: "lds-ellipsis2 var(--time) infinite",
  },
  " div:nth-of-type(4)": {
    left: 56,
    animation: "lds-ellipsis3 var(--time) infinite",
  },
  "@keyframes lds-ellipsis1": {
    "0%": {
      transform: "scale(0)",
    },
    "100%": {
      transform: "scale(1)",
    },
  },
  "@keyframes lds-ellipsis3": {
    "0%": {
      transform: "scale(1)",
    },
    "100%": {
      transform: "scale(0)",
    },
  },
  "@keyframes lds-ellipsis2": {
    "0%": {
      transform: "translate(0, 0)",
    },
    "100%": {
      transform: "translate(24px, 0)",
    },
  },
}));

const Typo = styled(Typography)({
  "&:after": {
    content: "'...'",
    animation: "content 2s infinite"
  },
  "@keyframes content": {
    "0%": {
      content: "''"
    },
    "25%": {
      content: "'.'"
    },
    "50%": {
      content: "'..'"
    },
    "75%": {
      content: "'...'"
    },
    "100%": {
      content: "''"
    },
  }
})

export type LeftBottomLoaderProps = {
  label?: React.ReactNode;
};
export const LeftBottomLoader = ({ label }: LeftBottomLoaderProps) => {
  return (
    <Container>
      <Box display="flex" flexDirection="row" alignItems={"center"}>
        <Root>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </Root>
        {label && (
          <Typo
            variant="body2"
            color="inherit"
            sx={{ marginLeft: "1rem", textTransform: "uppercase" }}
          >
            {label}
          </Typo>
        )}
      </Box>
    </Container>
  );
};
