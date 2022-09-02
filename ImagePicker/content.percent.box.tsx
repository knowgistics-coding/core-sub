
import {
  Box,
  BoxProps,
  LinearProgress,
  styled,
  Typography
} from '@mui/material'
import { BoxItem } from './content.box.item'

const ImgStyled = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  '&:hover': {
    objectFit: 'cover'
  }
})

export const PercentBox = styled(
  ({ value, file, ...props }: { value?: number; file?: File } & BoxProps) => {
    const url = file ? URL.createObjectURL(file) : ''
    return (
      <BoxItem>
        <div>
          {url && (
            <ImgStyled
              src={url}
              style={{ filter: `saturate(${value ? value / 100 : 0})` }}
            />
          )}
          <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'flex-end'}
            {...props}
          >
            {typeof value === 'number' && (
              <Typography variant='caption' color={'inherit'}>
                {value}%
              </Typography>
            )}
            <LinearProgress
              variant={
                typeof value === 'number' ? 'determinate' : 'indeterminate'
              }
              value={value}
              color='inherit'
              style={{ width: '100%' }}
            />
          </Box>
        </div>
      </BoxItem>
    )
  }
)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  padding: '0.5rem',
  boxSizing: 'border-box'
})
