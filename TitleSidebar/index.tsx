import {
  ListItem,
  ListItemProps,
  ListItemText,
  ListItemTextProps
} from '@mui/material'


export interface TitleSidebarProps extends ListItemProps {
  title?: string
  listItemTextProps?: ListItemTextProps
}
export const TitleSidebar = ({
  title,
  listItemTextProps,
  ...props
}: TitleSidebarProps) => {
  return (
    <ListItem {...props}>
      <ListItemText
        primary={'Title'}
        secondary={title || 'No Title'}
        primaryTypographyProps={{ variant: 'caption', color: 'textSecondary' }}
        secondaryTypographyProps={{
          variant: 'h6',
          color: title ? 'textPrimary' : 'textSecondary'
        }}
        {...listItemTextProps}
      />
    </ListItem>
  )
}
