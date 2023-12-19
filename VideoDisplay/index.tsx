import React, { lazy, Suspense } from "react";
import { Box, BoxProps, styled } from "@mui/material";
import { YoutubeIframe } from "./youtube.iframe";
import { facebook_parser, loom_parser, youtube_parser } from "./parser";
import { FaceBookIframe } from "./facebook.iframe";
import { LoomIframe } from "./loom.iframe";
import { PickIcon, PickIconName } from "../PickIcon";

const VideoJS = lazy(() => import("../VideoJS"));

const icons: Record<string, PickIconName> = {
  youtube: "youtube",
  facebook: "facebook",
};

export interface VideoContent {
  value?: string;
  ratio?: number;
  from?: "facebook" | "link" | "youtube" | "loom";
}
export type VideoDisplayProps = {
  value?: VideoContent;
  secondaryActions?: React.ReactNode;
} & BoxProps;

const Placeholder = styled(({ from, ...props }: { from: string }) => (
  <Box {...props}>
    <PickIcon size="4x" color="inherit" icon={icons[from] || "video"} />
  </Box>
))(({ theme }) => ({
  ...theme.mixins.absoluteFluid,
  border: "none",
  color: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundImage: theme.palette.neutral.main,
}));

const VDRoot = styled(({ value, ...props }: VideoDisplayProps) => (
  <Box {...props} />
))<VideoDisplayProps>(({ theme, value }) => ({
  position: "relative",
  backgroundImage: value?.value ? "none" : theme.palette.neutral.main,
  "&:after": {
    content: '""',
    display: "block",
    paddingTop: `calc(100% * ${value?.ratio || 9 / 16})`,
  },
  "& img": {
    width: "100%",
    height: "100%",
  },
}));

export const VideoDisplay = ({
  value,
  secondaryActions,
}: VideoDisplayProps) => {
  return (
    <VDRoot value={value}>
      {value?.value &&
        value?.from &&
        (() => {
          switch (value.from) {
            case "facebook":
              if (facebook_parser(value.value)) {
                return <FaceBookIframe src={facebook_parser(value.value)} />;
              }
              return <Placeholder from={value.from} />;
            case "link":
              if (value.value) {
                return (
                  <Suspense fallback={<div>Loading...</div>}>
                    <VideoJS
                      options={{
                        sources: [
                          {
                            src: value.value,
                            type: "video/mp4",
                          },
                        ],
                      }}
                    />
                  </Suspense>
                );
              }
              return <Placeholder from={value.from} />;
            case "youtube":
              if (youtube_parser(value.value)) {
                return <YoutubeIframe yid={youtube_parser(value.value)} />;
              }
              return <Placeholder from={value.from} />;
            case "loom":
              if (loom_parser(value.value)) {
                return <LoomIframe src={loom_parser(value.value)} />;
              }
              return <Placeholder from="link" />;
            default:
              return <Placeholder from={value.from} />;
          }
        })()}
      {secondaryActions}
    </VDRoot>
  );
};
