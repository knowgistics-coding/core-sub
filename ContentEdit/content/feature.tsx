
import { useCE } from '../ctx'
import { StockDisplay } from '../../StockDisplay'
import { useCore } from '../../context'

export const CEFeature = (): JSX.Element | null => {
  const { isMobile } = useCore()
  const { data, show } = useCE()

  return show.includes('feature') && data?.cover ? (
    <StockDisplay
      image={data?.cover?.image}
      pos={data?.cover?.pos}
      ratio={isMobile ? 1 : 1 / 4}
    />
  ) : null
}
