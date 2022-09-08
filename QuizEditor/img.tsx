import { styled } from '@mui/material'

import { apiURL } from '../StockPicker/controller'

export interface QDImgDisplayProps {
  id: string
}

export const QDImgDisplay = styled(
  ({
    id,
    ...props
  }: QDImgDisplayProps & React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img src={`${apiURL}/file/id/${id}`} alt={`${id}-display`} {...props} />
  )
)({
  width: 'auto',
  maxWidth: '100%',
  maxHeight: '20vh',
  marginLeft: 'auto',
  marginRight: 'auto'
})
