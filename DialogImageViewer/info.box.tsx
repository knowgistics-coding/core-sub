import { Box, BoxProps, Skeleton, styled } from "@mui/material";
import clsx from "clsx";

export type InfoBoxProps = BoxProps & {
  loading?: boolean;
};
export const InfoBox = styled(({ loading, ...props }: InfoBoxProps) => {
  return (
    <Box {...props} className={clsx("info-box", props.className)}>
      {loading ? (
        <>
          <Skeleton width="80%" height={48} />
          <Skeleton width="50%" height={18} />
          <Skeleton width="40%" height={18} />
          <Skeleton width="50%" height={18} />
          <Skeleton width="40%" height={18} />
        </>
      ) : (
        <>{props.children}</>
      )}
    </Box>
  );
})<BoxProps>(({ theme }) => ({
  boxSizing: "border-box",
  width: theme.sidebarWidth * 1.5,
  height: '100%',
  overflow: "auto",
  padding: theme.spacing(2),
}));
