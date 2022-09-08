import { styled } from '@mui/material'


export interface HighlightItemContentProps {}
export const HighlightItemContent = styled(
  (props: HighlightItemContentProps) => {
    return <div {...props}>Content</div>
  }
)(({ theme }) => ({
  width: '100%',
  height: '100%',
  padding: theme.spacing(2),
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[50],
  flex: 1
}))
