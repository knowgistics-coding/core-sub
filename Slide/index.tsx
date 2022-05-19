import { Box, styled } from '@mui/material'
import { grey } from '@mui/material/colors'

import { SwiperContainer } from './swiper.container'
import { ReactIdSwiperChildren } from 'react-id-swiper'

export const Root = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: grey[100],
  '--swiper-theme-color': theme.palette.primary.main,
  '&:before': {
    content: "''",
    display: 'block',
    paddingTop: 'calc(100% / 3)'
  }
}))

export const SwiperItem = styled('div')({
  position: 'relative'
})
export const SwiperItemContent = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white'
})

export { SlideItem } from './item'
export { SlideItemFeature } from './item.feature'
export { SlideItemContent } from './item.content'
export interface SlideContainerProps {
  children?: ReactIdSwiperChildren
}

export const SlideContainer = (props: SlideContainerProps) => {
  return (
    <Root>
      <SwiperContainer>{props.children}</SwiperContainer>
    </Root>
  )
}
