import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, BoxProps, styled } from "@mui/material";

export interface CreditDisplayProps extends BoxProps {
  type: string;
  value: string;
  uid?: string;
  isAbsolute?: boolean;
}

export const CreditDisplay = styled(
  ({ type, value, uid, ...props }: CreditDisplayProps) => {
    return (
      <Box {...props}>
        {(() => {
          switch (type) {
            default:
              return (
                <React.Fragment>
                  <FontAwesomeIcon icon={["fad", "camera"]} />
                  &nbsp;
                  <a
                    href={`https://mek.network/profile/view/${uid}`}
                    target="_blank"
                  >
                    {value}
                  </a>
                </React.Fragment>
              );
          }
        })()}
      </Box>
    );
  }
)<CreditDisplayProps>(({ theme, isAbsolute }) => ({
  ...theme.typography.caption,
  color: "white",
  padding: theme.spacing(0, 0.5),
  backgroundColor: `rgba(0,0,0,0.5)`,
  "& a": { color: "inherit" },
  ...(isAbsolute
    ? {
        position: "absolute",
        top: 0,
        left: 0,
      }
    : {}),
}));
