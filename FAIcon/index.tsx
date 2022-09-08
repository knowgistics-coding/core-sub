import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { styled } from '@mui/material'

export const FAIcon = styled(FontAwesomeIcon)(({ theme }) => ({
  '--fa-primary-color': theme.palette.primary.main
}))
