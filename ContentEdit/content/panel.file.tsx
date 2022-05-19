
import { useCE } from '../ctx'
import { fileTypes } from '../ctx.d'
import { CEPanel } from './panel'
import { FileDisplay } from '../../FileDisplay'
import { useCore } from '../../context'

interface CEFilePanelProps {
  content: fileTypes
  index: number
}
export const CEFilePanel = ({ content, index }: CEFilePanelProps) => {
  const { Link } = useCore()
  const { post } = useCE()

  return (
    <CEPanel
      maxWidth={post ? 'post' : undefined}
      contentKey={content.key}
      index={index}
    >
      {content?.value?.name && (
        <FileDisplay
          Link={Link}
          content={{
            value: {
              name: content.value.name,
              size: content.value.size,
              original: content.value.original
            }
          }}
        />
      )}
    </CEPanel>
  )
}
