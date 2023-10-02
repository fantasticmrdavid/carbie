import React, { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { Template } from '@/app/components/Template/Template'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <Template>
            <Component {...pageProps} />
          </Template>
        </ChakraProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
