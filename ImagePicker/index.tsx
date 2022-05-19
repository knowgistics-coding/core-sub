import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { KuiButton } from '../KuiButton'
import { useCore } from '../context'
import { SheetGroup } from '../SheetGroup'
import { FAIcon } from '../FAIcon'
import { IMPContent } from './content'
import { ImagePickerController } from './ctl'
import { defaultState, IMPContext, IMPContextTypes } from './ctx'
import update from 'react-addons-update'
import { IMPFromUrl } from './from.url'
import { ImageDataMongoTypes } from '../skeleton.controller'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface ImagePickerProps {
  children: React.ReactElement
  open?: boolean
  onConfirm: (imgs: ImageDataMongoTypes[]) => void
  multiple?: boolean
}

export const ImagePicker = ({
  children,
  open: defaultOpen,
  onConfirm,
  multiple
}: ImagePickerProps) => {
  const { fb, isMobile, t, user } = useCore()
  const [open, setOpen] = useState(false)
  const [controller, setController] =
    useState<IMPContextTypes['controller']>(null)
  const [state, setState] = useState<IMPContextTypes['state']>({
    ...defaultState
  })

  const store = {
    controller,
    state,
    setState,
    multiple: Boolean(multiple)
  }

  const handleUpload = async (files: FileList) => {
    if (user.data) {
      setState((s) => ({ ...s, files: Array.from(files), uploading: true }))
      for (let i = 0; i < files.length; i++) {
        await controller?.upload(user.data, files[i], (progress) => {
          setState((s) =>
            update(s, { progress: { [files[i].size]: { $set: progress } } })
          )
        })
      }
      const docs = await controller?.list()
      setState(
        update(defaultState, {
          uploading: { $set: false },
          loading: { $set: false },
          docs: { $set: docs || [] }
        })
      )
    }
  }
  const handleConfirm = () => {
    const docs = state.docs.filter((doc) => state.selected.includes(doc._id))
    onConfirm(docs)
    setState({ ...defaultState })
    setOpen(false)
  }
  const handleRemove = async () => {
    setState((s) => ({ ...s, loading: true }))
    await controller?.delete(state.selected)
    const docs = await controller?.list()
    setState((s) => ({ ...s, loading: false, docs: docs || [], selected: [] }))
  }

  useEffect(() => {
    if (typeof defaultOpen === 'boolean') {
      setOpen(defaultOpen)
    }
  }, [defaultOpen])

  useEffect(() => {
    if (fb && user.loading === false && user.data && open) {
      const control = new ImagePickerController(fb, user.data)
      setController(control)
      control
        .list()
        .then((docs) => setState((s) => ({ ...s, loading: false, docs })))
    } else {
      setState({ ...defaultState })
    }
  }, [fb, user, open])

  return (
    <IMPContext.Provider value={store}>
      {React.cloneElement(children, {
        onClick: () => setOpen(true)
      })}
      <Dialog
        fullWidth
        maxWidth='md'
        fullScreen={isMobile}
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>
          {state.selected.length
            ? `Selected ${state.selected.length} item(s)`
            : 'Image Picker'}
        </DialogTitle>
        <DialogContent dividers>
          <IMPContent />
        </DialogContent>
        <DialogActions>
          <SheetGroup
            buttons={[
              {
                label: t('Upload'),
                type: 'upload',
                buttonProps: {
                  startIcon: <FAIcon icon={['fad', 'upload']} />
                },
                onChange: handleUpload,
                inputProps: {
                  multiple: true,
                  type: 'file',
                  accept: 'image/*'
                }
              },
              {
                label: t('From URL'),
                buttonProps: {
                  startIcon: <FAIcon icon={['fad', 'link']} />
                },
                onClick: () =>
                  setState((s) =>
                    update(s, { open: { fromurl: { $set: true } } })
                  )
              },
              state.selected.length
                ? {
                    label: t('Remove'),
                    buttonProps: {
                      color: 'error',
                      startIcon: <FontAwesomeIcon icon={['fad', 'trash']} />
                    },
                    onClick: handleRemove
                  }
                : undefined
            ]}
          />
          <Box flex={1} />
          <KuiButton
            tx='confirm'
            onClick={handleConfirm}
            disabled={!Boolean(state.selected.length)}
          />
          <KuiButton tx='cancel' onClick={() => setOpen(false)} />
        </DialogActions>
      </Dialog>
      <IMPFromUrl />
    </IMPContext.Provider>
  )
}
