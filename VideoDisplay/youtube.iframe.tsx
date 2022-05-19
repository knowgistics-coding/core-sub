import { styled } from '@mui/material'

export interface YoutubeIframeProps {
  yid: string
}
export const YoutubeIframe = styled(({ yid, ...props }: YoutubeIframeProps) => (
  <div {...props}>
    <iframe
      src={`https://www.youtube.com/embed/${yid}`}
      title='YouTube video player'
      frameBorder='0'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      allowFullScreen
    ></iframe>
  </div>
))(() => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  '&>iframe': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  }
}))
