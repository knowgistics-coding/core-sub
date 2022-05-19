import { CircularProgress, styled } from "@mui/material";
import { BoxItem } from './content.box.item'

export const Loading = styled((props) => (
  <BoxItem {...props}>
    <div className='center'>
      <CircularProgress color='inherit' size={64} thickness={4} />
    </div>
  </BoxItem>
))({})