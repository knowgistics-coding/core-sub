import { TextField, TextFieldProps } from '@mui/material'
import React, { useEffect, useState } from 'react'
import debounce from 'lodash.debounce'

export interface DebounceTextFieldProps
  extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value?: string
  onChange: (value: string) => void
}
export const DebounceTextField = ({
  value: defaultValue,
  onChange,
  ...props
}: DebounceTextFieldProps) => {
  const [value, setValue] = useState<string>('')

  const handleChange = ({
    target: { value }
  }: React.ChangeEvent<HTMLInputElement>) => {
    setValue(value)
    debouncedChangeHandler(value)
  }

  const debouncedChangeHandler = React.useCallback(
    debounce((value: string) => onChange(value), 500),
    []
  )

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue)
    }
  }, [defaultValue])

  return <TextField value={value} onChange={handleChange} {...props} />
}
