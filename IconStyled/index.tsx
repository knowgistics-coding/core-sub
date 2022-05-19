import {
  FontAwesomeIcon,
  FontAwesomeIconProps
} from '@fortawesome/react-fontawesome'
import { styled } from '@mui/material'

export interface IconStyledProps extends FontAwesomeIconProps {}
export const IconStyled = styled(FontAwesomeIcon)(({ theme }) => ({
  '--fa-primary-color': theme.palette.primary.main,
  // '--fa-secondary-color': theme.palette.text.primary,
}))
