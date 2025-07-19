import React, { useState } from 'react'

import styles from '@/styles/components/FileTransfer.module.scss'

export const FileListViewer: React.FC = () => {
  const [files, setFiles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const URL =
    'https://jtajjlhx34.execute-api.ap-northeast-1.amazonaws.com/narumikr/get-file-list'

  const fetchFiles = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(URL)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      setFiles(data.files || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch files')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h2>S3 File List</h2>
      <button onClick={fetchFiles} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Files'}
      </button>

      {error ? <p style={{ color: 'red' }}>Error: {error}</p> : null}

      <ul>
        {files.map((file, index) => (
          <li key={index}>{file}</li>
        ))}
      </ul>
    </div>
  )
}

export default FileListViewer
