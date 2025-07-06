import type { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {}
  }
}

const ManagementTop = () => {
  return <p>Test</p>
}
export default ManagementTop
