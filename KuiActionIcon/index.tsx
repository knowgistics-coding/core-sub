import {
  FontAwesomeIcon,
  FontAwesomeIconProps
} from '@fortawesome/react-fontawesome'
import { IconButton, IconButtonProps } from '@mui/material'


const IconXS = (props: FontAwesomeIconProps) => (
  <FontAwesomeIcon size='xs' {...props} />
)

export interface KuiActionIconProps extends IconButtonProps {
  tx: 'add' | 'cancel' | 'check' | 'copy' | 'edit' | 'info' | 'remove'
}
export const KuiActionIcon = ({ tx, ...props }: KuiActionIconProps) => {
  let newProps = {}

  switch (tx) {
    case 'add':
      newProps = {
        children: <IconXS icon={['fad', 'plus']} />,
        ...props
      }
      break
    case 'cancel':
      newProps = {
        children: <IconXS icon={['fad', 'xmark']} />,
        ...props
      }
      break
    case 'check':
      newProps = {
        children: <IconXS icon={['fad', 'check']} />,
        color: 'primary',
        ...props
      }
      break
    case 'copy':
      newProps = {
        children: <IconXS icon={['fad', 'copy']} />,
        ...props
      }
      break
    case 'edit':
      newProps = {
        children: <IconXS icon={['fad', 'edit']} />,
        color: 'primary',
        ...props
      }
      break
    case 'info':
      newProps = {
        children: <IconXS icon={['fad', 'info-circle']} />,
        ...props
      }
      break
    case 'remove':
      newProps = {
        children: <IconXS icon={['fad', 'trash']} />,
        color: 'error',
        ...props
      }
      break
    default:
      newProps = {
        ...props
      }
      break
  }

  return <IconButton size='small' {...newProps} />
}
