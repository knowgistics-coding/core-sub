import React, { cloneElement, Fragment, useState } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grow,
  ButtonProps
} from '@mui/material'
import { KuiButton } from '../KuiButton'
import { useCore } from '../context'

export interface DialogAlertProps {
  children: React.ReactElement
  title?: React.ReactNode
  label: React.ReactNode
  onConfirm: () => void
  confirmLabel?: React.ReactNode
  secondaryButtons?: {
    color?: ButtonProps['color']
    label: React.ReactNode
    onClick: () => void
  }[]
}
export const DialogAlert = (props: DialogAlertProps) => {
  const { t } = useCore()
  const [open, setOpen] = useState<boolean>(false)

  const handleOpen = (open: boolean) => () => setOpen(open)
  const handleClick = (func: () => void) => () => {
    func()
    setOpen(false)
  }

  return (
    <Fragment>
      {props.children &&
        cloneElement(props.children, {
          onClick: handleOpen(!open)
        })}
      <Dialog
        fullWidth
        maxWidth='xs'
        open={open}
        onClose={handleOpen(false)}
        TransitionComponent={Grow}
      >
        <DialogTitle>{props.title || t('Title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.label}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color='primary' onClick={handleClick(props.onConfirm)}>
            {props.confirmLabel || t('Confirm')}
          </Button>
          {props.secondaryButtons &&
            props.secondaryButtons.map((item, index) => {
              return (
                <Button
                  color={item.color}
                  onClick={handleClick(item.onClick)}
                  key={index}
                >
                  {item.label}
                </Button>
              )
            })}
          <KuiButton tx='cancel' onClick={handleOpen(false)} />
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}
