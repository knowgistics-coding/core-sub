import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemText,
  styled
} from '@mui/material'
import { grey } from '@mui/material/colors'


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
                props.selected ? ['fad', 'check-circle'] : ['far', 'circle']
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
  border: `solid 1px ${grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  '&:not(:last-child)': {
    marginBottom: theme.spacing(1)
  },
  '&.Mui-selected': {
    border: `solid 1px ${theme.palette.primary.dark}`,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    },
    '& .MuiListItemIcon-root': {
      color: 'inherit'
    },
    '& .MuiTypography-root': {
      color: 'inherit'
    }
  }
}))
