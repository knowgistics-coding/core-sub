import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Slide,
  SlideProps,
  Box,
  DialogProps,
  ButtonProps
} from '@mui/material'
import React, {
  cloneElement,
  forwardRef,
  Fragment,
  useEffect,
  useState
} from 'react'
import { useCore } from '../context'
import { KuiButton } from '../KuiButton'

export interface DialogPreProps {
  onConfirm?: () => Promise<any>
  button: React.ReactElement
  maxWidth?: DialogProps['maxWidth']
  title?: React.ReactNode
  children: React.ReactNode
  secondaryActions?: React.ReactNode
  confirmButtonProps?: ButtonProps
  open?: boolean
}
export const DialogPre = forwardRef((props: DialogPreProps, ref) => {
  const { t } = useCore()
  const [open, setOpen] = useState(false)

  const handleOpen = (o: boolean) => () => setOpen(o)
  const handleConfirm = async () => {
    if (props.onConfirm) {
      await props.onConfirm()
      setOpen(false)
    }
  }

  useEffect(() => {
    if (props.open !== undefined) {
      setOpen(props.open)
    }
  }, [props.open])

  return (
    <Fragment>
      {props.button &&
        cloneElement(props.button, {
          ref,
          onClick: handleOpen(!open)
        })}
      <Dialog
        fullWidth
        maxWidth={props.maxWidth || 'xs'}
        open={open}
        onClose={handleOpen(false)}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'down' } as SlideProps}
        disableEnforceFocus
      >
        <DialogTitle>{props.title || t('Title')}</DialogTitle>
        <DialogContent>{props.children}</DialogContent>
        <DialogActions>
          {props.secondaryActions}
          <Box flex={1} />
          {props.onConfirm && (
            <Button
              color='primary'
              children={t('Confirm')}
              {...props.confirmButtonProps}
              onClick={handleConfirm}
            />
          )}
          <KuiButton tx='close' onClick={handleOpen(false)} />
        </DialogActions>
      </Dialog>
    </Fragment>
  )
})
