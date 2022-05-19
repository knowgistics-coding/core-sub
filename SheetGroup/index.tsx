import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Slide,
  SlideProps,
  styled
} from '@mui/material'
import React, { useState } from 'react'
import { useCore } from '../context'

export const Root = styled(Box)({
  '&>:not(:last-child)': {
    marginRight: '0.5rem'
  }
})

interface buttonTypes {
  label: React.ReactNode
  onClick: () => void
  buttonProps?: ButtonProps
  type?: null
  onChange?: null
  inputProps?: null
}
interface uploadTypes
  extends Omit<buttonTypes, 'type' | 'onClick' | 'onChange' | 'inputProps'> {
  type: 'upload'
  onClick?: null
  onChange: (files: FileList) => any
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}
export interface SheetGroupProps {
  buttons: (buttonTypes | uploadTypes | undefined)[]
}
export const SheetGroup = ({ buttons }: SheetGroupProps) => {
  const { isMobile, t } = useCore()
  const [open, setOpen] = useState<boolean>(false)

  const handleAction = (func: (() => void) | null | undefined) => () => {
    if (func) {
      func()
    }
    setOpen(false)
  }

  if (isMobile) {
    return (
      <Root>
        <Button
          variant='outlined'
          endIcon={<FontAwesomeIcon icon={['fad', 'caret-down']} />}
          onClick={() => setOpen(true)}
        >
          {t('More')}
        </Button>
        <Dialog
          fullWidth
          open={open}
          onClose={() => setOpen(false)}
          TransitionComponent={Slide}
          TransitionProps={{ direction: 'up' } as SlideProps}
        >
          <List>
            {buttons.map(
              (item: buttonTypes | uploadTypes | undefined, index: number) => {
                if (!item) {
                  return null
                }
                switch (item.type) {
                  case 'upload':
                    return (
                      <label key={index}>
                        <input
                          type='file'
                          {...item.inputProps}
                          hidden
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const files = event.target.files
                            if (files) {
                              item.onChange(files)
                            }
                            setOpen(false)
                          }}
                        />
                        <ListItemButton>
                          {(item?.buttonProps?.startIcon ||
                            item?.buttonProps?.startIcon) && (
                            <ListItemIcon>
                              {item?.buttonProps?.startIcon ||
                                item?.buttonProps?.startIcon}
                            </ListItemIcon>
                          )}
                          <ListItemText primary={item.label} />
                        </ListItemButton>
                      </label>
                    )
                  default:
                    return (
                      <ListItemButton
                        key={index}
                        onClick={handleAction(item.onClick)}
                      >
                        {(item?.buttonProps?.startIcon ||
                          item?.buttonProps?.startIcon) && (
                          <ListItemIcon>
                            {item?.buttonProps?.startIcon ||
                              item?.buttonProps?.startIcon}
                          </ListItemIcon>
                        )}
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    )
                }
              }
            )}
            <ListItemButton onClick={handleAction(null)}>
              <ListItemText
                primary={t('Cancel')}
                primaryTypographyProps={{ color: 'error', textAlign: 'center' }}
              />
            </ListItemButton>
          </List>
        </Dialog>
      </Root>
    )
  } else {
    return (
      <Root>
        {buttons.map((item, index) => {
          if (!item) {
            return null
          }
          switch (item?.type) {
            case 'upload':
              return (
                <label key={index}>
                  <input
                    type='file'
                    {...item.inputProps}
                    hidden
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const files = event.target.files
                      if (files !== null && item?.onChange) {
                        item?.onChange(files)
                      }
                    }}
                  />
                  <Button
                    color='neutral'
                    variant='outlined'
                    {...item.buttonProps}
                    component='span'
                  >
                    {item.label}
                  </Button>
                </label>
              )
            default:
              return (
                <Button
                  color='neutral'
                  variant='outlined'
                  {...item.buttonProps}
                  key={index}
                  onClick={handleAction(item.onClick)}
                >
                  {item.label}
                </Button>
              )
          }
        })}
      </Root>
    )
  }
}
