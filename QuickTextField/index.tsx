import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  TextField,
  TextFieldProps,
  Typography,
  TypographyProps
} from '@mui/material'
import React, { useEffect, useState } from 'react'

export interface QuickTextFieldProps {
  value: string
  onChange: (value: string) => void
  textFieldProps?: TextFieldProps
  showIcon?: boolean
  placeholder?: string
  variant?: TypographyProps['variant']
}
export const QuickTextField = ({
  value,
  onChange,
  textFieldProps,
  showIcon,
  placeholder,
  variant
}: QuickTextFieldProps) => {
  const [edit, setEdit] = useState<boolean>(false)
  const [newValue, setValue] = useState<string>('')

  const handleEditToggle = () => setEdit((e) => !e)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value)
  const handleBlur = () => {
    setEdit(false)
    setValue(value)
  }
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Escape', 'Enter'].includes(event.key)) {
      if (event.key === 'Enter') {
        onChange(newValue)
      } else if (event.key === 'Escape') {
        setValue(value)
      }
      setEdit(false)
      event.preventDefault()
    }
  }

  useEffect(() => {
    setValue(value)
  }, [value])

  return (
    <div style={{ cursor: 'pointer' }}>
      {edit ? (
        <TextField
          autoFocus
          fullWidth
          {...textFieldProps}
          value={newValue}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          helperText='Press ESC to cancel or Enter to comfirm'
        />
      ) : (
        <Typography
          variant={variant}
          color={value ? undefined : 'textSecondary'}
          onClick={handleEditToggle}
        >
          {value || placeholder}
          {showIcon && (
            <FontAwesomeIcon
              icon={['far', 'edit']}
              style={{ marginLeft: 16 }}
            />
          )}
        </Typography>
      )}
    </div>
  )
}
