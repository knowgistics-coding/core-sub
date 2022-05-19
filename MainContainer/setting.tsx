
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from '@mui/material'
import { t } from '../Translate'
import { KuiButton } from '../KuiButton'
import { useMC } from './ctx'
import { QuickTextField } from '../QuickTextField'
import { ProfileImage } from '../ProfileImage'
import i18next from 'i18next'
import { useCore } from '../context'
import { StockImageTypes } from '../StockPicker'
import { updateProfile } from 'firebase/auth'
import { apiURL } from '../StockPicker/controller'
// import { MCLine } from './line'

const GridName = ({ children }: { children?: React.ReactNode }) => {
  const { isMobile } = useCore()
  return (
    <Grid item xs={12} sm={4}>
      <Typography variant='body1' color={'textSecondary'}>
        {children}
      </Typography>
      {!isMobile && <Box mb={4} />}
    </Grid>
  )
}
const GridSet = ({
  children,
  dense
}: {
  children?: React.ReactNode
  dense?: boolean
}) => {
  return (
    <Grid item xs={12} sm={8}>
      {children}
      {!dense && <Box mb={4} />}
    </Grid>
  )
}

export const MCSetting = () => {
  const { open, handleOpen, user } = useMC()
  const { isMobile } = useCore()
  const lang = i18next.language

  const handleChangeLang = (event: SelectChangeEvent<string>) => {
    const value = event.target.value
    i18next.changeLanguage(value)
    window.localStorage.setItem('defaultLanguage', value)
  }
  const handleChangeDisplayName = async (displayName: string) => {
    if (user.data) {
      await updateProfile(user.data, {
        displayName
      })
      await user.data.reload()
    }
  }
  const handleChangePhotoURL = async ([img]: StockImageTypes[]) => {
    if (img && user.data) {
      await updateProfile(user.data, {
        photoURL: `${apiURL}/file/id/${img._id}/thumbnail`
      })
      await user.data.reload()
    }
  }

  return (
    <Dialog
      fullWidth
      fullScreen={isMobile}
      maxWidth='sm'
      open={open.setting}
      onClose={handleOpen('setting', false)}
    >
      <DialogTitle>{t('Setting')}</DialogTitle>
      <DialogContent dividers={isMobile} style={{ paddingBottom: 0 }}>
        <Box pt={1} />
        <Grid container alignItems={'center'} spacing={2}>
          <GridName>{t('Display Name')}</GridName>
          <GridSet>
            <QuickTextField
              showIcon
              value={user.data?.displayName || ''}
              onChange={handleChangeDisplayName}
            />
          </GridSet>
          <GridName>{t('Profile Image')}</GridName>
          <GridSet>
            <ProfileImage
              src={user.data?.photoURL || undefined}
              onChange={handleChangePhotoURL}
            />
          </GridSet>
          <GridName>{t('Language')}</GridName>
          <GridSet dense>
            <Select
              size='small'
              variant='outlined'
              value={['en', 'th'].includes(lang) ? lang : 'en'}
              onChange={handleChangeLang}
            >
              <MenuItem value='en'>English</MenuItem>
              <MenuItem value='th'>ไทย</MenuItem>
            </Select>
          </GridSet>
          {/* <GridName>{t('Line Application')}</GridName>
          <GridSet>
            <MCLine />
          </GridSet> */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <KuiButton
          tx='close'
          color='neutral'
          onClick={handleOpen('setting', false)}
        />
      </DialogActions>
    </Dialog>
  )
}
