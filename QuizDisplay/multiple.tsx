import { Fragment, useEffect, useState } from 'react'
import { arrayShuffle } from '../func'
import { dataTypes } from '../QuizEditor/context'
import { QDImgDisplay } from '../QuizEditor/img'
import { useQD } from './context'
import { ListButton } from './list.button'
import { QDParagraph } from './paragraph'

export const QDMultiple = () => {
  const { answer, quiz, setAnswer, onChange } = useQD()
  const [options, setOptions] = useState<dataTypes[]>([])

  const handleChange = (key: number) => () => {
    setAnswer({ multiple: key })
    onChange({ multiple: key })
  }

  useEffect(() => {
    if (quiz?.multiple?.options) {
      const options = quiz.shuffle
        ? arrayShuffle(quiz.multiple.options)
        : quiz.multiple.options
      setOptions(options)
    }
  }, [quiz])

  return (
    <Fragment>
      {options.map((option) => {
        switch (option.type) {
          case 'image':
            return (
              <ListButton
                label={
                  option.image?._id ? (
                    <QDImgDisplay id={option.image._id} />
                  ) : null
                }
                onClick={handleChange(option.key)}
                selected={answer?.multiple === option.key}
                key={option.key}
              />
            )
          case 'paragraph':
            return (
              <ListButton
                label={
                  option?.paragraph ? (
                    <QDParagraph value={option?.paragraph} />
                  ) : null
                }
                onClick={handleChange(option.key)}
                selected={answer?.multiple === option.key}
                key={option.key}
              />
            )
          default:
            return null
        }
      })}
    </Fragment>
  )
}
