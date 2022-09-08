
import { ListItemText, ListItemTextProps } from '@mui/material'
import merge from 'lodash.merge'

export interface KuiListItemTextProps extends ListItemTextProps {
  tx: 'sidebar' | 'body'
}
export const KuiListItemText = ({ tx, ...props }:KuiListItemTextProps) => {
  const { primaryTypographyProps, secondaryTypographyProps, ...others } = props
  switch (tx) {
    case 'sidebar':
      return (
        <ListItemText
          {...others}
          primaryTypographyProps={merge(
            { variant: 'body2' },
            primaryTypographyProps
          )}
          secondaryTypographyProps={secondaryTypographyProps}
        />
      )
    default:
      return (
        <ListItemText
          {...others}
          primaryTypographyProps={merge(
            { color: 'textSecondary' },
            primaryTypographyProps
          )}
          secondaryTypographyProps={secondaryTypographyProps}
        />
      )
  }
}