import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  TextField
} from '@mui/material'
import { grey } from '@mui/material/colors'
import React, { useEffect } from 'react'
import update from 'react-addons-update'
import { useCore } from '../../../context'
import { DialogPre } from '../../../DialogPre'
import { VideoContent, VideoDisplay } from '../../../VideoDisplay'
import { usePE } from '../../context'
import { PEPanel } from '../../panel'
import { PEEditorProps } from '../heading'

const ChangeButton = styled(Button)({
  position: 'absolute',
  top: '1rem',
  right: '1rem'
})

export const PEEditorVideo = ({ index, content }: PEEditorProps) => {
  const { t } = useCore()
  const { setData } = usePE()
  const fromList: VideoContent['from'][] = ['link', 'facebook', 'youtube']
  const [video, setVideo] = React.useState<VideoContent>({})

  const handleChangeFrom = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as VideoContent['from']
    setVideo((v) => ({ ...v, from: value }))
  }
  const handleChangeURL = ({
    target: { value }
  }: React.ChangeEvent<HTMLInputElement>) => {
    setVideo((v) => ({ ...v, value }))
  }
  const handleChangeRatio = ({
    target: { value }
  }: SelectChangeEvent<number>) => {
    if (typeof value === 'number') {
      setVideo((v) => ({ ...v, ratio: value }))
    }
  }
  const handleConfirm = async () =>
    setData((d) =>
      update(d, { contents: { [index]: { video: { $set: video } } } })
    )

  useEffect(() => {
    if (content?.video) {
      setVideo(content.video)
    }
  }, [content?.video])

  return (
    <PEPanel content={content} contentKey={content.key} index={index}>
      <Box sx={{ position: 'relative', backgroundColor: grey[200] }}>
        <VideoDisplay content={content?.video} />
        <DialogPre
          title={t('Setting')}
          button={
            <ChangeButton
              variant='outlined'
              color='light'
              startIcon={<FontAwesomeIcon icon={['fad', 'cog']} />}
              sx={{zIndex:1}}
            >
              {t('Setting')}
            </ChangeButton>
          }
          onConfirm={handleConfirm}
          secondaryActions={
            <Button color='error' onClick={() => setVideo({})}>
              {t('Clear')}
            </Button>
          }
        >
          <Box pt={1} />
          <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
            <InputLabel>{t('From')}</InputLabel>
            <Select
              label={t('From')}
              value={video?.from || ''}
              onChange={handleChangeFrom}
            >
              {fromList.map((value) => (
                <MenuItem value={value} key={value}>
                  {value?.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label='URL'
            value={video?.value || ''}
            onChange={handleChangeURL}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>{t('Ratio')}</InputLabel>
            <Select
              label={t('Ratio')}
              value={video?.ratio || 9 / 16}
              onChange={handleChangeRatio}
            >
              <MenuItem value={9 / 16}>16:9</MenuItem>
              <MenuItem value={4 / 3}>4:3</MenuItem>
              <MenuItem value={1}>1:1</MenuItem>
            </Select>
          </FormControl>
        </DialogPre>
      </Box>
    </PEPanel>
  )
}
