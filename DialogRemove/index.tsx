import {
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  SlideProps
} from '@mui/material'

import { useCore } from '../context'
import { KuiButton } from '../KuiButton'

export interface DialogRemoveProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: React.ReactNode
  label?: React.ReactNode
  confirmButtonProps?: ButtonProps
}
export const DialogRemove = ({
  open,
  onClose,
  onConfirm,
  ...props
}: DialogRemoveProps) => {
  const { t } = useCore()

  return (
    <Dialog
      fullWidth
      maxWidth='xs'
      open={open}
      onClose={onClose}
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' } as SlideProps}
    >
      <DialogTitle>{props.title || t('Remove')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {props.label || t('Do you want to remove?')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <KuiButton tx='cancel' color='primary' onClick={onClose} />
        <KuiButton
          {...props.confirmButtonProps}
          tx='remove'
          onClick={onConfirm}
        />
      </DialogActions>
    </Dialog>
  )
}
