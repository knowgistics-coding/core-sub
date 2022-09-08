import { Box, Typography } from '@mui/material'

import { QDImgDisplay } from '../QuizEditor/img'
import { useQD } from './context'
import { QDParagraph } from './paragraph'

export const QDQuestion = () => {
  const { quiz } = useQD()

  switch (quiz?.question?.type) {
    case 'image':
      return quiz?.question?.image?._id ? (
        <Box mb={2} display='flex' justifyContent='center'>
          <QDImgDisplay id={quiz.question.image._id} />
        </Box>
      ) : null
    case 'paragraph':
      return (
        <Typography variant='body1' color='textSecondary' component='div'>
          <QDParagraph value={quiz.question.paragraph} paragraph />
        </Typography>
      )
    default:
      return null
  }
}
