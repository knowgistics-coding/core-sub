import { Box, Grid, LinearProgress, styled } from '@mui/material'
import { grey } from '@mui/material/colors'
import { useEffect, useState } from 'react'

const Root = styled('div')({
  position: 'relative',
  width: '100%',
  backgroundColor: grey[300],
  '&:before': {
    content: "''",
    display: 'block',
    paddingTop: '100%'
  }
})

const ImgStyled = styled('img')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  objectFit: 'cover',
  filter: 'brightness(0.5)'
})

const ProgressContainer = styled(Box)({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  padding: 4,
  boxSizing: 'border-box',
})

export const DragUploadItem = ({
  file,
  progress = -1
}: {
  file: File
  progress: number
}) => {
  const [state, setState] = useState({
    url: ''
  })

  useEffect(() => {
    const fileURL = URL.createObjectURL(file)
    const image = new Image()
    image.src = fileURL
    image.onload = () => {
      var canvas = document.createElement('canvas')
      var width = 256
      var height = (image.height / image.width) * 256
      canvas.width = width
      canvas.height = height
      var ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(image, 0, 0, width, height)
        let resized = canvas.toDataURL('image/jpeg', 0.5)
        setState((s) => ({ ...s, url: resized }))
      }
    }
  }, [file])

  return (
    <Grid item xs={6} sm={3}>
      <Root>
        <ImgStyled src={state.url} />
        <ProgressContainer>
          <LinearProgress
            value={progress > -1 ? progress : 0}
            variant={progress > -1 ? 'determinate' : 'indeterminate'}
          />
        </ProgressContainer>
      </Root>
    </Grid>
  )
}
