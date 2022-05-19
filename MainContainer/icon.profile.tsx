
import { Avatar, CircularProgress, IconButton } from '@mui/material'
import { useMC } from './ctx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const MCIconProfile = () => {
  const { user, setState } = useMC()

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) =>
    setState((s) => ({ ...s, anchorProfile: event.currentTarget }))

  return (
    <IconButton edge='end' color='inherit' onClick={handleOpen}>
      {user.loading ? (
        <CircularProgress size={36} color='inherit' />
      ) : user.data ? (
        <Avatar src={user.data?.photoURL || undefined} />
      ) : (
        <FontAwesomeIcon icon={["fad","sign-in"]} />
      )}
    </IconButton>
  )
}
