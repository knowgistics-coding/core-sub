
import { VideoDisplay } from '../../VideoDisplay'
import { useCE } from '../ctx'
import { vdoTypes } from '../ctx.d'
import { CEPanel } from './panel'

interface CEVdoPanelProps {
  content: vdoTypes
  index: number
}
export const CEVdoPanel = ({ content, index }: CEVdoPanelProps) => {
  const { post } = useCE()

  return (
    <CEPanel
      maxWidth={post ? 'post' : undefined}
      contentKey={content.key}
      index={index}
    >
      <VideoDisplay content={content} />
    </CEPanel>
  )
}
