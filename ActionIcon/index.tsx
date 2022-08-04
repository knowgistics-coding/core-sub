import { IconButton, IconButtonProps, styled } from '@mui/material'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
  FontAwesomeIcon,
  FontAwesomeIconProps
} from '@fortawesome/react-fontawesome'
import { useCore } from '../context'

export type ActionIconProps = IconButtonProps & {
  icon: IconProp
  iconProps?: Omit<FontAwesomeIconProps, 'icon'>
}
export const ActionIcon = styled(({ icon, iconProps, ...props }: ActionIconProps) => {
  const { isMobile } = useCore()
  return (
    <IconButton size={isMobile ? 'medium' : 'small'} color="info" {...props}>
      <FontAwesomeIcon icon={icon} {...iconProps} />
    </IconButton>
  )
})({

})
