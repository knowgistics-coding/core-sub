import { Box, styled } from '@mui/material'
import { Absatz, AbsatzProps } from '../Absatz'

export const QDParagraph = styled(
  ({ className, ...props }: { className?: string } & AbsatzProps) => (
    <Box className={className}>
      <Absatz view {...props} />
    </Box>
  )
)<{ paragraph?: boolean } & AbsatzProps>(({ theme, paragraph }) => ({
  '& .public-DraftStyleDefault-block': {
    marginTop: `0px !important`,
    marginBottom: `${paragraph ? theme.spacing(2) : `0px`} !important`
  }
}))
