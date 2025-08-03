import { SocketProvider } from '@/context/SocketProvider'
import React from 'react'

interface Props {
    children: React.ReactNode
}

const Layout = ({
    children
}: Props) => {
  return (
    <SocketProvider>
        {children}
    </SocketProvider>
  )
}

export default Layout