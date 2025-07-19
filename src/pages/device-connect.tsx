// import { useEffect, useState } from 'react'

// import type { GetStaticProps } from 'next'

// export const getStaticProps: GetStaticProps = async () => {
//   return {
//     props: {}
//   }
// }

// const DeviceConnect = () => {
//   const [message, setMessage] = useState('')
//   useEffect(() => {
//     const searchParams = new URLSearchParams(window.location.search)
//     const deviceId = searchParams.get('deviceId')
//     if (!deviceId) {
//       return
//     }
//     const socket = new WebSocket(
//       `wss://2mho65l0y6.execute-api.ap-northeast-1.amazonaws.com/production/?device_id=${deviceId}`
//     )
//     socket.onopen = () => {
//       setMessage('✅ WebSocket接続成功')
//     }
//     socket.onerror = (err) => {
//       setMessage('❌ 接続エラー', err)
//     }

//     socket.onclose = () => {
//       setMessage('🔌 接続切断')
//     }
//   }, [])
//   return (
//     <div>
//       <h3>Device Connect</h3>
//       <p>{message}</p>
//     </div>
//   )
// }
// export default DeviceConnect

import { useEffect, useState } from 'react'

import type { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {}
  }
}

const DeviceConnect = () => {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const deviceId = searchParams.get('deviceId')
    if (!deviceId) {
      setMessage('❌ deviceId が URL に見つかりません')
      return
    }

    const socket = new WebSocket(
      `wss://2mho65l0y6.execute-api.ap-northeast-1.amazonaws.com/production/?device_id=${deviceId}`
    )

    socket.onopen = () => {
      setMessage('✅ WebSocket接続成功')
    }

    socket.onerror = (err) => {
      console.error('❌ WebSocket 接続エラー', err)
      setMessage('❌ WebSocket接続エラー')
    }

    socket.onclose = () => {
      setMessage('🔌 接続切断')
    }

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'file_download') {
          setMessage(`📥 ファイル受信: ${data.file_name}`)

          // 自動ダウンロード処理
          const a = document.createElement('a')
          a.href = data.url
          a.download = data.file_name
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        } else {
          console.log('📨 受信メッセージ:', data)
        }
      } catch (e) {
        console.error('❌ メッセージの解析に失敗:', e)
      }
    }

    return () => {
      socket.close()
    }
  }, [])

  return (
    <div>
      <h3>Device Connect</h3>
      <p>{message}</p>
    </div>
  )
}

export default DeviceConnect
