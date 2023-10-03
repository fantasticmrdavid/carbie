import React from 'react'
import { useSession } from 'next-auth/react'
import Head from 'next/head'

import { Container, Flex, VStack } from '@chakra-ui/react'
import { NavBar } from '@/app/components/NavBar/NavBar'

type RootLayoutProps = {
  children: React.ReactNode
}

export const Template = ({ children }: RootLayoutProps) => {
  const { data: session, status: sessionStatus } = useSession()

  const head = (
    <Head>
      <title>~Carbie🍔~</title>
      <meta name={'viewport'} content="width=device-width, initial-scale=1" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/android-chrome-192x192.png"
      />
    </Head>
  )

  if (sessionStatus === 'loading') return <div>Loading...</div>

  if (session && session.user) {
    return (
      <>
        {head}
        <Flex
          style={{ minHeight: '100vh' }}
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'flex-start'}
        >
          <NavBar />
          {children}
        </Flex>
      </>
    )
  }

  return (
    <>
      {head}
      <Container>
        <Flex
          style={{ minHeight: '100vh' }}
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <VStack spacing={4} align="stretch">
            <main>{children}</main>
          </VStack>
        </Flex>
      </Container>
    </>
  )
}
