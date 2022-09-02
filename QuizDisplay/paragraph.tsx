import { Box, styled } from '@mui/material'

import { Paragraph, ParagraphProps } from '../ParagraphString'

export const QDParagraph = styled(
  ({ className, ...props }: { className?: string } & ParagraphProps) => (
    <Box className={className}>
      <Paragraph
        editorProps={{ toolbarHidden: true, readOnly: true }}
        {...props}
      />
    </Box>
  )
)<{ paragraph?: boolean } & ParagraphProps>(({ theme, paragraph }) => ({
  '& .public-DraftStyleDefault-block': {
    marginTop: `0px !important`,
    marginBottom: `${paragraph ? theme.spacing(2) : `0px`} !important`
  }
}))
