import { useState } from 'react'

import { Button, TextField } from '@mui/material'

import styles from '@/styles/components/FileTransfer.module.scss'

export const DeviceConnection = () => {
  const [inputIpAddress, setInputIpAddress] = useState('')
  const [connectDevice, setConnectDevice] = useState('')
  const [sendFileName, setSendFileName] = useState('')
  const [result, setResult] = useState('')
  const inputText = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputIpAddress(e.target.value)
  const inputFileName = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSendFileName(e.target.value)

  const onConnectDevice = async () => {
    const URL = `https://qe4uh58fsb.execute-api.ap-northeast-1.amazonaws.com/narumikr/get-connection-id?device_id=${inputIpAddress}`

    const res = await fetch(URL, {
      method: 'GET'
    })
    const { connectionId } = await res.json()
    setConnectDevice(connectionId)
  }

  const onSendFile = async () => {
    const URL = 'https://qe4uh58fsb.execute-api.ap-northeast-1.amazonaws.com/narumikr/send-file'
    const res = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        connection_id: connectDevice,
        file_name: sendFileName
      })
    })
    const data = await res.json()
    setResult(data.message || 'ファイル送信に失敗しました')
  }

  return (
    <div className={styles.container}>
      <h3>端末接続検索</h3>
      <TextField onChange={inputText} />
      <Button onClick={onConnectDevice}>検出する</Button>
      {connectDevice ? (
        <p>検出端末: {connectDevice}</p>
      ) : (
        <p>接続しているデバイスはありません</p>
      )}
      <TextField onChange={inputFileName} />
      <Button onClick={onSendFile}>ファイル送信</Button>
      <p>{result}</p>
    </div>
  )
}
