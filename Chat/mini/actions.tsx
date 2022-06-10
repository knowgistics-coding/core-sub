import { Box, Stack, StackProps, styled } from "@mui/material";

export const ChatActions = styled(({ className, ...props }: StackProps) => {
  return (
    <Box className={className}>
      <Stack direction="row" spacing={0.5} alignItems="center" {...props} />
    </Box>
  );
})(({ theme }) => ({
  padding: theme.spacing(1),
  boxSizing: "border-box",
}));
