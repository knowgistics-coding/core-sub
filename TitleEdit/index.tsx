import { Box, List, ListItem, ListItemText, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'

export interface TitleEditProps {
  value?: string
  onChange: (value: string) => void
}
export const TitleEdit = ({ value, onChange }: TitleEditProps) => {
  const [edit, setEdit] = useState<boolean>(false)
  const [title, setTitle] = useState('')

  const handleToggle = () => setEdit((e) => !e)
  const handleChange = ({
    target: { value }
  }: React.ChangeEvent<HTMLInputElement>) => setTitle(value)
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const key = event.key
    if (['Escape', 'Enter'].includes(key)) {
      if ('Enter' === key) {
        onChange(title)
      } else {
        setTitle(value || '')
      }
      setEdit(false)
      event.preventDefault()
    }
  }
  const handleBlur = () => {
    setEdit(false)
    setTitle(value || '')
  }

  useEffect(() => {
    if (value) {
      setTitle(value)
    }
  }, [value])

  return (
    <List disablePadding>
      {edit ? (
        <ListItem divider>
          <Box flex={1} pt={1}>
            <TextField
              autoFocus
              fullWidth
              label={'Title'}
              value={title}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              helperText='Press ESC to cancel or Enter to confirm'
              onBlur={handleBlur}
            />
          </Box>
        </ListItem>
      ) : (
        <ListItem button divider dense onClick={handleToggle}>
          <ListItemText
            primary={'Title'}
            secondary={value || 'No Title'}
            primaryTypographyProps={{
              variant: 'caption',
              color: 'textSecondary'
            }}
            secondaryTypographyProps={{
              variant: 'h6',
              color: Boolean(value) ? 'textPrimary' : 'textSecondary'
            }}
          />
        </ListItem>
      )}
    </List>
  )
}
