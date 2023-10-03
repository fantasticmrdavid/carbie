import React from 'react'
import Head from 'next/head'

import { Flex } from '@chakra-ui/react'
import { NavBar } from '@/app/components/NavBar/NavBar'

type RootLayoutProps = {
  children: React.ReactNode
}

export const Template = ({ children }: RootLayoutProps) => {
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
