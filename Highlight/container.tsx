
import { styled } from '@mui/material'
import SwiperCore, {
  Virtual,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
  Scrollbar,
  Parallax,
  Zoom,
  Lazy,
  Controller,
  A11y,
  History,
  HashNavigation,
  Autoplay,
  EffectFade,
  EffectCube,
  EffectFlip,
  EffectCoverflow,
  Thumbs
} from 'swiper'
import Swiper, {
  ReactIdSwiperProps,
  ReactIdSwiperChildren
} from 'react-id-swiper'
import 'swiper/scss'

SwiperCore.use([
  Virtual,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
  Scrollbar,
  Parallax,
  Zoom,
  Lazy,
  Controller,
  A11y,
  History,
  HashNavigation,
  Autoplay,
  EffectFade,
  EffectCube,
  EffectFlip,
  EffectCoverflow,
  Thumbs
])

const Root = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[100],
  '&:before': {
    content: '""',
    display: 'block',
    paddingTop: 'calc(100% * 360 / 960)'
  },
  '--swiper-theme-color': 'white'
}))
const Absolute = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  '& .swiper-container': {
    width: '100%',
    height: '100%',
    position: 'relative',
    listStyle: 'none',
    overflow: 'hidden',
    zIndex: 1
  },
  '& .swiper-wrapper': {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
    zIndex: 1
  },
  '& .swiper-slide': {
    width: '100%',
    height: '100%',
    flexShrink: 0
  }
})

export interface HighlightContainerProps {
  children: ReactIdSwiperChildren
}
export const HighlightContainer = ({ children }: HighlightContainerProps) => {
  const params: ReactIdSwiperProps = {
    slidesPerView: 'auto',
    spaceBetween: 30,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    observer: true
  }

  // {
  //   slidesPerView: 'auto',
  //   spaceBetween: 30,
  //   pagination: {
  //     el: '.swiper-pagination',
  //     clickable: true
  //   },
  //   navigation: {
  //     nextEl: '.swiper-button-next',
  //     prevEl: '.swiper-button-prev'
  //   },
  //   observer: true,
  //   ref: swiperRef
  // }

  return (
    <Root>
      <Absolute>
        <Swiper {...params}>{children}</Swiper>
      </Absolute>
    </Root>
  )
}
