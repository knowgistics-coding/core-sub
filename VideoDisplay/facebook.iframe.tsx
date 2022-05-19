import { styled } from '@mui/material'
export interface FaceBookIframeProps {
  src: string
}
export const FaceBookIframe = styled(
  ({ src, className }: FaceBookIframeProps & { className?: string }) => {
    return (
      <div className={className}>
        <iframe
          src={src}
          style={{ border: 'none', overflow: 'hidden' }}
          scrolling='no'
          frameBorder='0'
          allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
          allowFullScreen
        ></iframe>
      </div>
    )
  }
)(({}) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: 'black',
  '&>iframe': {
    width: '100%',
    height: '100%',
    '& html': {
      border: 'solid 1px red'
    }
  }
}))
