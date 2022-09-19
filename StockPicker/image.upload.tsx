import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@mui/material'
import React, { useState } from 'react'
import update from 'react-addons-update'
import { useCore } from '../context'
import { useSP } from './context'

const UploadIcon = () => <FontAwesomeIcon icon={['far', 'folder-open']} />

export const SPUpload = () => {
  const { t } = useCore()
  const { control, state, setState } = useSP()
  const [value, setValue] = useState<string>('')
  const [selfState, setSelfState] = useState({
    loading: false,
    progress: 0
  })

  const handleChange = async ({
    target: { value, files }
  }: React.ChangeEvent<HTMLInputElement>) => {
    setValue(value)
    setSelfState((s) => ({ ...s, loading: true }))
    if (files && files?.length && control) {
      const file = files[0]
      let result = await control.upload(file, (progress) => {
        setSelfState((s) => ({
          ...s,
          progress
        }))
      })
      const index = state.docs.findIndex((doc) => doc._id === result._id)
      if (index > -1) {
        result.datemodified = new Date().toString()
        setState((s) => update(s, { docs: { [index]: { $set: result } } }))
      } else {
        setState((s) => ({ ...s, docs: s.docs.concat(result) }))
      }
    }
    setSelfState((s) => ({ ...s, loading: false, progress: 0 }))
    setValue('')
  }

  return (
    <div>
      <label>
        <input
          type='file'
          hidden
          accept='image/*'
          value={value}
          onChange={handleChange}
        />
        {selfState.loading === false && (
          <Button
            variant='outlined'
            component='span'
            startIcon={<UploadIcon />}
          >
            {t('Browse')}
          </Button>
        )}
      </label>
      {selfState.loading && (
        <Button
          variant='outlined'
          disabled
          startIcon={<FontAwesomeIcon icon={['far', 'spinner']} pulse />}
        >
          Uploading {selfState.progress}%
        </Button>
      )}
    </div>
  )
}
