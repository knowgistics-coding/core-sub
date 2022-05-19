import { Box, BoxProps, styled, Theme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BlurhashImage } from '../StockDisplay/blurhash.image'

type ImageContainer = BoxProps & { ratio: number }
const ImageContainer = styled((props: ImageContainer) => <Box {...props} />)(
  ({ theme, ratio }: ImageContainer & { theme: Theme }) => ({
    position: 'relative',
    backgroundColor: theme.palette.grey[100],
    '&:before': {
      color: theme.palette.text.secondary,
      content: "''",
      display: 'block',
      paddingTop: `calc(100% * ${ratio})`
    }
  })
)
type ImageStyledProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  pos?: ImageDisplayProps['pos']
  hover?: ImageDisplayProps['hover']
}
const ImageStyled = styled(({ pos, hover, ...props }: ImageStyledProps) => (
  <img {...props} />
))(({ pos, hover }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: pos ? `${pos.left} ${pos.top}` : `50% 50%`,
  '&:hover': {
    objectFit: hover ? 'contain' : undefined
  }
}))

export interface ImageTypes {
  blurhash: string
  thumbnail: string
  medium?: string
  large?: string
  original: string
  id: string
}
export interface ImageDisplayProps {
  image?: ImageTypes
  pos?: {
    left: string
    top: string
  }
  ratio?: number
  hover?: boolean
  containerProps?: BoxProps
  // Must not have
  blurhash?: string
  id?: string
  medium?: string
  original?: string
  thumbnail?: string
}
export const ImageDisplay = ({
  image,
  pos,
  ratio,
  hover,
  containerProps
}: ImageDisplayProps) => {
  if (!image) {
    return null
  }

  const [state, setState] = useState<{ loading: boolean; ratio: number }>({
    loading: true,
    ratio: ratio || 1
  })

  useEffect(() => {
    if (image && !ratio) {
      const im = new Image()
      im.onload = () => {
        const { width, height } = im
        setState((s) => ({ ...s, loading: false, ratio: height / width }))
      }
      im.src = image.original
    } else {
      setState((s) => ({ ...s, loading: false, ratio: ratio || 1 }))
    }
  }, [image, ratio])

  return image ? (
    <ImageContainer ratio={state.ratio} {...containerProps}>
      {image.blurhash && (
        <BlurhashImage
          hash={image.blurhash}
          canvasProps={{
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }
          }}
        />
      )}
      {image && state.loading === false && (
        <ImageStyled src={image.original} pos={pos} hover={hover} />
      )}
    </ImageContainer>
  ) : null
}
