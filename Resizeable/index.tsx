import { Box, styled } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import interact from 'interactjs'
import { EdgeOptions } from '@interactjs/types'

const Root = styled(Box)(({ theme }) => ({
  position: 'relative',
  border: `dashed 2px ${theme.palette.primary.main}`,
  '& .corner': {
    width: 4,
    height: 4,
    border: `solid 1px ${theme.palette.primary.main}`,
    backgroundColor: 'white',
    position: 'absolute'
  },
  '& .corner:nth-of-type(1), .corner:nth-of-type(2), .corner:nth-of-type(3)': {
    top: -4
  },
  '& .corner:nth-of-type(4), .corner:nth-of-type(5), .corner:nth-of-type(6)': {
    top: `calc(50% - 2px)`
  },
  '& .corner:nth-of-type(7), .corner:nth-of-type(8), .corner:nth-of-type(9)': {
    bottom: -4
  },
  '& .corner:nth-of-type(1), .corner:nth-of-type(4), .corner:nth-of-type(7)': {
    left: -4
  },
  '& .corner:nth-of-type(2), .corner:nth-of-type(5), .corner:nth-of-type(8)': {
    left: `calc(50% - 2px)`
  },
  '& .corner:nth-of-type(3), .corner:nth-of-type(6), .corner:nth-of-type(9)': {
    right: -4
  }
}))

interface ResizeableProps {
  edge?: EdgeOptions
}
export const Resizeable = ({ edge }: ResizeableProps) => {
  const divRef = useRef<HTMLDivElement>()
  const [size, setSize] = useState({
    width: 100,
    height: 100
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pos, setPos] = useState({
    x: 0,
    y: 0
  })

  useEffect(() => {
    if (divRef.current) {
      interact(divRef.current).resizable({
        edges: edge || {
          top: true,
          right: true,
          bottom: true,
          left: true
        },
        listeners: {
          move: (event) => {
            const { width, height } = event.rect
            setSize({ width, height })
          }
        }
      })
    }
  }, [divRef])

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = 320
      canvasRef.current.height = 320
      canvasRef.current.style.backgroundColor = '#EEE'

      const context = canvasRef.current.getContext('2d')

      const image = new Image()
      image.src =
        'https://m.media-amazon.com/images/M/MV5BM2M2NjBlMDMtOTA4MC00Zjk5LTg1NmUtNGRjOTNjZmYwZjhiXkEyXkFqcGdeQXVyMjg0MTI5NzQ@._V1_.jpg'
      image.onload = () => {
        context?.drawImage(image, pos.x, pos.y)
      }
    }
  }, [canvasRef.current, pos.x, pos.y])

  useEffect(() => {
    if (canvasRef.current) {
      window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyW') {
          setPos((p) => ({ ...p, y: p.y - 20 }))
        } else if (e.code === 'KeyS') {
          setPos((p) => ({ ...p, y: p.y + 20 }))
        } else if (e.code === 'KeyA') {
          setPos((p) => ({ ...p, x: p.x - 20 }))
        } else if (e.code === 'KeyD') {
          setPos((p) => ({ ...p, x: p.x + 20 }))
        }
        console.log(e.code)
        e.preventDefault()
      })
    }
  }, [canvasRef.current])

  return (
    <React.Fragment>
      <Root ref={divRef} width={size.width} height={size.height}>
        width = {Math.round(size.width)}, height = {Math.round(size.height)}
        <div className='corner' />
        <div className='corner' />
        <div className='corner' />
        <div className='corner' />
        <div className='corner' />
        <div className='corner' />
        <div className='corner' />
        <div className='corner' />
        <div className='corner' />
      </Root>
      <canvas ref={canvasRef} />
    </React.Fragment>
  )
}
