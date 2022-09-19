// import { styled } from '@mui/material'
// import { useEffect, useRef, useState } from 'react'
// import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'
// import 'video.js/dist/video-js.css';

// export const VideoPlayer = styled(
//   ({ className, sources }: { className?: string } & VideoJsPlayerOptions) => {
//     const videoNode = useRef<HTMLVideoElement | null>(null)
//     const [player, setPlayer] = useState<null | VideoJsPlayer>(null)

//     useEffect(() => {
//       if (!player && videoNode.current !== null && sources) {
//         const currentPlayer = videojs(videoNode.current, {
//           sources,
//           controls: true
//         })
//         setPlayer(currentPlayer)
//         return () => {
//           console.log(sources, videoNode.current)
//           if (currentPlayer) {
//             currentPlayer.dispose()
//           }
//         }
//       } else {
//         return () => {}
//       }
//     }, [sources, player])

//     return (
//       <div className={className}>
//         <div data-vjs-player>
//           <pre>{JSON.stringify(sources, null, 2)}</pre>
//           <video id='show' ref={videoNode} className='video-js'></video>
//         </div>
//       </div>
//     )
//   }
// )({
//   position: 'absolute',
//   top: 0,
//   left: 0,
//   width: '100%',
//   height: '100%',
//   '& .video-js': {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%'
//   }
// })
export {}