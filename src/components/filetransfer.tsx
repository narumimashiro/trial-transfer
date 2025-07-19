import { useState } from 'react'

import { Button } from '@mui/material'

import styles from '@/styles/components/FileTransfer.module.scss'

export const FileTransfer = () => {
  const URL =
    'https://jtajjlhx34.execute-api.ap-northeast-1.amazonaws.com/narumikr/get-upload-file-url'

  const [status, setStatus] = useState('アップロードできるかな')
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
  }

  const handleUpload = async () => {
    if (!file) {
      setStatus('ファイルを選択してください')
      return
    }

    setStatus('署名付きURLを取得中...')

    const res = await fetch(URL, {
      method: 'GET'
    })
    const { uploadUrl, publicUrl } = await res.json()

    setStatus('S3にアップロード中...')

    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'video/mp4'
      },
      body: file
    })

    if (putRes.ok) {
      setStatus(`アップロード完了！: ${publicUrl}`)
    } else {
      setStatus('アップロード失敗')
    }
  }

  return (
    <div className={styles.container}>
      <h3>動画ファイルを保存する</h3>
      <input type="file" accept="video/mp4" onChange={handleFileChange} />
      <Button variant="outlined" onClick={handleUpload}>
        ファイルをアップロードする
      </Button>
      <p>{status}</p>
    </div>
  )
}
