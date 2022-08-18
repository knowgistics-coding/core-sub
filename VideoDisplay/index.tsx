import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, BoxProps, styled } from "@mui/material";
import { YoutubeIframe } from "./youtube.iframe";
import { facebook_parser, loom_parser, youtube_parser } from "./parser";
import { FaceBookIframe } from "./facebook.iframe";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import VideoJS from "../VideoJS";
import { LoomIframe } from "./loom.iframe";

const icons: { [key: string]: IconProp } = {
  youtube: ["fab", "youtube"],
  facebook: ["fab", "facebook"],
};

const Placeholder = styled(({ from, ...props }: { from: string }) => (
  <Box {...props}>
    <FontAwesomeIcon
      size="4x"
      color="inherit"
      icon={icons[from] || ["fad", "video"]}
    />
  </Box>
))(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  border: "none",
  color: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundImage: theme.palette.neutral.main,
}));

const VDRoot = styled(
  ({ content, ...props }: { content?: VideoContent } & BoxProps) => (
    <Box {...props} />
  )
)<VideoDisplayProps>(({ theme, content }) => ({
  position: "relative",
  backgroundImage: content?.value ? "none" : theme.palette.neutral.main,
  "&:after": {
    content: '""',
    display: "block",
    paddingTop: `calc(100% * ${content?.ratio || 9 / 16})`,
  },
  "& img": {
    width: "100%",
    height: "100%",
  },
}));

export interface VideoContent {
  value?: string;
  ratio?: number;
  from?: "facebook" | "link" | "youtube" | "loom";
}
export interface VideoDisplayProps {
  content?: VideoContent;
  secondaryActions?: React.ReactNode;
}
export const VideoDisplay = ({
  content,
  secondaryActions,
}: VideoDisplayProps) => {
  return (
    <VDRoot content={content}>
      {content?.value &&
        content?.from &&
        (() => {
          switch (content.from) {
            case "facebook":
              if (facebook_parser(content.value)) {
                return <FaceBookIframe src={facebook_parser(content.value)} />;
              }
              return <Placeholder from={content.from} />;
            case "link":
              if (content.value) {
                return (
                  <VideoJS
                    options={{
                      sources: [
                        {
                          src: content.value,
                          type: "video/mp4",
                        },
                      ],
                    }}
                  />
                );
              }
              return <Placeholder from={content.from} />;
            case "youtube":
              if (youtube_parser(content.value)) {
                return <YoutubeIframe yid={youtube_parser(content.value)} />;
              }
              return <Placeholder from={content.from} />;
            case "loom":
              if (loom_parser(content.value)) {
                return <LoomIframe src={loom_parser(content.value)} />;
              }
              return <Placeholder from="link" />;
            default:
              return <Placeholder from={content.from} />;
          }
        })()}
      {secondaryActions}
    </VDRoot>
  );
};
