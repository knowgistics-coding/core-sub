import { Typography } from '@mui/material'

import { useCore } from '../context'
import { BoxItem } from './content.box.item'

export const NoImageBox = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { t } = useCore()
  return (
    <BoxItem>
      <div {...props} className='center'>
        <Typography>{t('No Image')}</Typography>
      </div>
    </BoxItem>
  )
}
