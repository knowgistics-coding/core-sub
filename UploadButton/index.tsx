import React, { Fragment } from 'react'
import { Button, ButtonProps } from '@mui/material'

const genKey = () => Math.floor(Math.random() * 1000000).toString()

export type UploadButtonProps = {
  onChange: (files: FileList) => void
  accept?: string
  multiple?: boolean
} & ButtonProps
export const UploadButton = ({
  onChange,
  accept,
  multiple,
  ...props
}: UploadButtonProps) => {
  const id = `upload-button-${genKey()}`

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = event.target.files
    if (files?.length) {
      onChange(files)
    }
  }

  return (
    <Fragment>
      <input
        id={id}
        type='file'
        onChange={handleChange}
        accept={accept}
        hidden
        multiple={multiple}
      />
      <label htmlFor={id}>
        <Button {...props} component='span' />
      </label>
    </Fragment>
  )
}
