import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemText,
  styled
} from '@mui/material'


export const ListButton = styled(
  ({
    label,
    icon,
    ...props
  }: {
    label: React.ReactNode
    icon?: React.ReactNode
  } & ListItemButtonProps) => {
    return (
      <ListItemButton {...props}>
        <ListItemIcon>
          {icon ? (
            icon
          ) : (
            <FontAwesomeIcon
              icon={
                props.selected ? ['far', 'check-circle'] : ['far', 'circle']
              }
            />
          )}
        </ListItemIcon>
        <ListItemText
          primary={label}
          primaryTypographyProps={{ color: 'textSecondary', component: 'div' }}
        />
      </ListItemButton>
    )
  }
)(({ theme }) => ({
  border: `solid 1px ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  '&:not(:last-child)': {
    marginBottom: theme.spacing(1)
  },
  '&.Mui-selected': {
    border: `solid 1px ${theme.palette.info.dark}`,
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.info.dark
    },
    '& .MuiListItemIcon-root': {
      color: 'inherit'
    },
    '& .MuiTypography-root': {
      color: 'inherit'
    }
  }
}))
