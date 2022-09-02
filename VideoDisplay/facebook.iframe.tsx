import { styled } from "@mui/material";
import { HTMLAttributes } from "react";
export interface FaceBookIframeProps extends HTMLAttributes<HTMLIFrameElement> {
  src: string;
}
export const FaceBookIframe = styled(
  ({ src, className }: FaceBookIframeProps) => {
    return (
      <div className={className}>
        <iframe
          src={src}
          style={{ border: "none", overflow: "hidden" }}
          scrolling="no"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          title={`${src}`}
        ></iframe>
      </div>
    );
  }
)(() => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  backgroundColor: "black",
  "&>iframe": {
    width: "100%",
    height: "100%",
    "& html": {
      border: "solid 1px red",
    },
  },
}));
