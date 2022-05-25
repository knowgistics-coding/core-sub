import {
  Box,
  Button,
  Grid,
  ListItem,
  ListItemProps,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { ActionIcon } from '../ActionIcon'
import { useCore } from '../context'
import { ImageDisplay, ImageDisplayProps } from '../ImageDisplay'
import { FIEMove } from './edit/move'
import { PosTypes } from '../DialogImagePosition'
import { KuiButton } from '../KuiButton'
import { StockImageTypes, StockPicker } from '../StockPicker'
import {
  StockDisplay,
  StockDisplayImageTypes,
  StockDisplayProps
} from '../StockDisplay'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface FeatureImageProps extends Omit<ImageDisplayProps, 'ratio'> {}
export const FeatureImage = ({ image, pos }: FeatureImageProps) => {
  const { isMobile } = useCore()
  return <ImageDisplay image={image} pos={pos} ratio={isMobile ? 1 : 1 / 4} />
}

export interface FeatureImageEditProps {
  listItemProps?: ListItemProps
  value?: StockDisplayProps
  onChange: (data: StockDisplayProps) => void
  onRemove?: () => void
}
export const FeatureImageEdit = ({
  listItemProps,
  value,
  onChange,
  onRemove
}: FeatureImageEditProps) => {
  const { t } = useCore()
  const [mobile, setMobile] = useState<boolean>(false)
  const [data, setData] = useState<StockDisplayProps>({})
  const [open, setOpen] = useState<boolean>(false)

  const handleToggleMobile = () => setMobile((m) => !m)
  const handleChangePos = (pos: PosTypes) =>
    setData((d) => {
      onChange?.({ ...d, pos })
      return { ...d, pos }
    })
  const handleChangeImage = ([img]: StockImageTypes[]) => {
    if (img) {
      const { blurhash, _id, width, height, credit } = img
      const image: StockDisplayImageTypes = {
        blurhash,
        _id,
        width,
        height,
        credit
      }
      setData((d) => {
        onChange?.({ ...d, image })
        return { ...d, image }
      })
    }
  }

  useEffect(() => {
    if (value) {
      setData(value)
    }
  }, [value])

  return (
    <ListItem divider {...listItemProps}>
      <Box display={'flex'} flexDirection={'column'} flex={1}>
        <Box display={'flex'} alignItems={'center'}>
          <Typography variant='caption' color='textSecondary'>
            {t('FeatureImage')}
          </Typography>
          <Box flex={1} />
          <ActionIcon
            icon={mobile ? ['far', 'mobile'] : ['far', 'tv']}
            onClick={handleToggleMobile}
          />
          {data?.image && (
            <FIEMove image={data.image} onChange={handleChangePos} />
          )}
        </Box>
        {data.image && (
          <Box py={1}>
            <StockDisplay
              image={data.image}
              pos={data.pos}
              ratio={mobile ? 1 : 0.25}
            />
          </Box>
        )}
        <Box flex={1}>
          <Grid container spacing={1}>
            <Grid item xs={data.image ? 6 : 12}>
              <Button
                fullWidth
                variant='outlined'
                onClick={() => setOpen(true)}
                startIcon={<FontAwesomeIcon icon={['far', 'folder-open']} />}
              >
                {t('Browse')}
              </Button>
              <StockPicker
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={handleChangeImage}
              />
            </Grid>
            {data.image && (
              <Grid item xs={6} onClick={() => onRemove?.()}>
                <KuiButton fullWidth variant='outlined' tx='remove' />
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </ListItem>
  )
}
