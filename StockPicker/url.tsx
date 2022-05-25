import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button } from '@mui/material'

import { DialogPrompt } from '../DialogPrompt'
import { useSP } from './context'
import { useAlerts } from '../Alerts'
import { StockImageTypes } from './controller'
import {Fragment} from 'react'

export const FromURL = (props: {
  onConfirm: (data: StockImageTypes) => void
}) => {
  const { control } = useSP()
  const { addAlert } = useAlerts()

  const handleConvert = async (value: string) => {
    if (value && control) {
      const file = await control.fromURL(value).catch((err) => {
        addAlert({ label: err.message, severity: 'error' })
      })
      if (file) {
        const result = await control.upload(file).catch((err) => {
          addAlert({ label: err.message, severity: 'error' })
        })
        if (result) {
          props.onConfirm(result)
        }
      }
    }
  }

  return (
    <Fragment>
      <Box ml={2} />
      <DialogPrompt
        title='Import from URL'
        label='URL'
        onConfirm={handleConvert}
        clearAfterConfirm
      >
        <Button
          variant='outlined'
          startIcon={<FontAwesomeIcon icon={['far', 'link']} />}
          color="neutral"
        >
          From URL
        </Button>
      </DialogPrompt>
    </Fragment>
  )
}
