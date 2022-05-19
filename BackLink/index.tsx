import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, List, ListItem } from '@mui/material'

import { useCore } from '../context'

export interface BackLinkProps {
  to: string
  target?: string
  divider?: boolean
}
export const BackLink = ({ divider, to, target }: BackLinkProps) => {
  const { Link, t } = useCore()

  return (
    <List>
      <ListItem divider={Boolean(divider)}>
        <Button
          size='small'
          component={Link}
          to={to}
          startIcon={<FontAwesomeIcon icon={["fad","chevron-left"]} />}
          target={target || '_self'}
        >
          {t("Back")}
        </Button>
      </ListItem>
    </List>
  )
}
