
import update from 'react-addons-update'
import { useAlerts } from '../Alerts'
import { DialogPrompt } from '../DialogPrompt'
import { useIMP } from './ctx'

export const IMPFromUrl = () => {
  const { addAlert } = useAlerts()
  const { state, setState, controller } = useIMP()

  const handleConfirm = async (url: string) => {
    setState((s) => ({ ...s, loading: true }))
    const result = await controller?.fromURL(url)
    if (result.error) {
      addAlert({ label: result.message, severity: 'error' })
      setState((s) =>
        update(s, {
          open: { fromurl: { $set: false } },
          loading: { $set: false }
        })
      )
    } else {
      const docs = await controller?.list()
      setState((s) =>
        update(s, {
          open: { fromurl: { $set: false } },
          docs: { $set: docs },
          loading: { $set: false }
        })
      )
    }
  }
  const handleAbort = () =>
    setState((s) => update(s, { open: { fromurl: { $set: false } } }))

  return (
    <DialogPrompt
      open={Boolean(state.open.fromurl)}
      title='From URL'
      label='URL'
      onConfirm={handleConfirm}
      onAbort={handleAbort}
      clearAfterConfirm
    />
  )
}
