import React from 'react'
import Head from 'next/head'

import { Container, Flex, VStack } from '@chakra-ui/react'
import { NavBar } from '@/app/components/NavBar/NavBar'
import { Footer } from '@/app/components/Footer/Footer'
import { usePathname } from 'next/navigation'
import { BackButton } from '@/app/components/BackButton/BackButton'

type RootLayoutProps = {
  children: React.ReactNode
}

export const Template = ({ children }: RootLayoutProps) => {
  const pathname = usePathname()
  const head = (
    <Head>
      <title>~Carbie~</title>
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

  const isRoot = pathname === '/'

  return (
    <>
      {head}
      <VStack align="stretch">
        <Flex
          style={{ minHeight: '100vh' }}
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={isRoot ? 'space-between' : 'flex-start'}
        >
          <NavBar />
          {!isRoot && (
            <div style={{ width: '100%', padding: '0.5em 1em' }}>
              <BackButton />
            </div>
          )}
          <Container flex={isRoot ? 0 : 1}>{children}</Container>

          <Footer />
        </Flex>
      </VStack>
    </>
  )
}
