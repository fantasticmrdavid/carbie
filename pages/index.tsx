import React from 'react'
import { useSession } from 'next-auth/react'
import LoginPage from '@/pages/login'

const IndexPage = () => {
  const { data: session } = useSession()

  if (!session?.user) {
    return <LoginPage />
  }

  return <>Logged in!</>
}

export default IndexPage
