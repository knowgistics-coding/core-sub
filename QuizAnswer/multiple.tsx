import { Fragment, useEffect, useState } from 'react'
import { arrayShuffle } from '../func'
import { dataTypes } from '../QuizEditor/context'
import { QDImgDisplay } from '../QuizEditor/img'
import { useQD } from './context'
import { ListButton } from './list.button'
import { QDParagraph } from './paragraph'

export const QDMultiple = () => {
  const { answer, quiz } = useQD()
  const [options, setOptions] = useState<dataTypes[]>([])

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
        if(answer?.multiple === option.key /*|| quiz.multiple?.answer === option.key*/){
          switch (option.type) {
            case 'image':
              return (
                <ListButton
                  label={
                    option.image?._id ? (
                      <QDImgDisplay id={option.image._id} />
                    ) : null
                  }
                  correct={quiz.multiple?.answer === option.key}
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
                  correct={quiz.multiple?.answer === option.key}
                  key={option.key}
                />
              )
            default:
              return null
          }
        }
        return null
      })}
    </Fragment>
  )
}
