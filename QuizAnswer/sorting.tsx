import { Fragment, useEffect, useState } from 'react'
import { useQD } from './context'
import { Box, List } from '@mui/material'
import { ListButton } from './list.button'
import { QDParagraph } from './paragraph'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { QDImgDisplay } from '../QuizEditor/img'

export const QDSorting = () => {
  const { quiz, answer } = useQD()
  const [keys, setKeys] = useState<number[]>([])

  useEffect(() => {
    if (answer?.sorting) {
      setKeys(answer.sorting)
    }
  }, [answer?.sorting])

  return (
    <Fragment>
      <List>
        {keys.map((key, index) => {
          const item = quiz.sorting?.options.find(
            (option) => option.key === key
          )
          if (item) {
            return (
              <ListButton
                key={key}
                label={(() => {
                  switch (item.type) {
                    case 'image':
                      return item?.image?._id ? (
                        <Box>
                          <QDImgDisplay id={item.image._id} />
                        </Box>
                      ) : undefined
                    case 'paragraph':
                      return <QDParagraph value={item.paragraph} />
                    default:
                      return undefined
                  }
                })()}
                icon={<FontAwesomeIcon icon={['fad', 'arrows']} />}
                correct={quiz.sorting?.answers?.[index] === key}
              />
            )
          }
          return null
        })}
      </List>
    </Fragment>
  )
}
