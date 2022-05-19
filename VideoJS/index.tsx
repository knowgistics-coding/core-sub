import { Box, styled } from "@mui/material";
import React, { useState } from "react";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.css";

const Root = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  "&>div": {
    width: "100%",
    height: "100%",
  },
});

export interface VideoJSProps {
  options: VideoJsPlayerOptions;
  onReady?: (player: VideoJsPlayer) => void;
}
export const VideoJS = (props: VideoJSProps) => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [player, setPlayer] = useState<VideoJsPlayer | undefined>();
  const { options, onReady } = props;

  React.useEffect(() => {
    if (player) {
      if (options.autoplay) {
        player.autoplay(options.autoplay);
      }
      if (options.sources) {
        player.src(options.sources);
      }
    } else {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const player = videojs(videoElement, options, () => {
        onReady && onReady(player);
      });
      setPlayer(player);
    }
  }, [options, videoRef, onReady, player]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [player]);

  return (
    <Root>
      <div data-vjs-player>
        <video
          ref={videoRef}
          controls
          className="video-js vjs-big-play-centered"
        />
      </div>
    </Root>
  );
};

export default VideoJS;
