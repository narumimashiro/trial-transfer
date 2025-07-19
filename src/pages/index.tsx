import { DeviceConnection } from '@/components/deviceconnection'
import FileListViewer from '@/components/filediplay'
import { FileTransfer } from '@/components/filetransfer'

import styles from '@/styles/ManagementTop.module.scss'

import type { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {}
  }
}

const ManagementTop = () => {
  return (
    <div className={styles.container}>
      <h1>Management Top Page</h1>
      <FileTransfer />
      <FileListViewer />
      <DeviceConnection />
    </div>
  )
}
export default ManagementTop
