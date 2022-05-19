import { IconButton, IconButtonProps } from '@mui/material'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
  FontAwesomeIcon,
  FontAwesomeIconProps
} from '@fortawesome/react-fontawesome'
import { useCore } from '../context'

export type ActionIconProps = IconButtonProps & {
  icon: IconProp
  iconProps?: FontAwesomeIconProps
}
export const ActionIcon = ({ icon, iconProps, ...props }: ActionIconProps) => {
  const { isMobile } = useCore()
  return (
    <IconButton size={isMobile ? 'medium' : 'small'} {...props}>
      <FontAwesomeIcon icon={icon} {...iconProps} />
    </IconButton>
  )
}
