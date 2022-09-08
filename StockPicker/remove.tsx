import React, { useState } from 'react'
import { KuiButton } from '../KuiButton'
import { useSP } from './context'
import { DialogRemove } from '../DialogRemove'

export const SPRemove = () => {
  const { state, setState, control } = useSP()
  const [rem, setRem] = useState<boolean>(false)

  const handleRemove = () => setRem(true)
  const handleRemoveConfirm = async () => {
    setState((s) => ({ ...s, loading: true }))
    if (control && state.selected.length) {
      const promises = state.selected.map(
        async (id) => await control.remove(id)
      )
      await Promise.all(promises)
      setState((s) => ({
        ...s,
        selected: [],
        docs: s.docs.filter((doc) => !s.selected.includes(doc._id))
      }))
    }
    setState((s) => ({ ...s, loading: false }))
    setRem(false)
  }

  return state.selected.length ? (
    <React.Fragment>
      &nbsp;
      <KuiButton variant='outlined' tx='remove' onClick={handleRemove} />
      <DialogRemove
        open={rem}
        onClose={() => setRem(false)}
        onConfirm={handleRemoveConfirm}
      />
    </React.Fragment>
  ) : null
}
