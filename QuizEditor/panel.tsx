

import {
  Accordion,
  AccordionProps,
  AccordionActions,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  Box,
  Typography,
  styled
} from '@mui/material'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ExpandIcon = () => (
  <FontAwesomeIcon size='xs' icon={['far', 'chevron-down']} />
)

const AccordionSummary = styled(MuiAccordionSummary)({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  borderBottom: '1px solid rgba(0, 0, 0, .125)',
  marginBottom: -1,
  minHeight: 48,
  '&$expanded': {
    minHeight: 48
  }
})

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2)
}))

export interface PanelProps {
  expanded?: AccordionProps['expanded']
  onChange?: AccordionProps['onChange']
  title?: AccordionProps['children']
  children?: AccordionProps['children']
  actions?: AccordionProps['children']
}
export const Panel = styled(
  ({ expanded, onChange, title, children, actions }: PanelProps) => {
    return (
      <Accordion expanded={expanded} onChange={onChange}>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography variant='h6'>
            <strong>{title}</strong>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box flex={1}>{children}</Box>
        </AccordionDetails>
        {actions && <AccordionActions>{actions}</AccordionActions>}
      </Accordion>
    )
  }
)(({ theme }) => ({
  border: `solid 1px ${theme.palette.grey[300]}`,
  boxShadow: 'none'
}))
