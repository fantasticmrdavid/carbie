import React from 'react'
import { signIn } from 'next-auth/react'
import { Button, Center, Container, Flex, VStack } from '@chakra-ui/react'
import { Logo } from '@/app/components/Logo/Logo'

export const LoginPage = () => {
  return (
    <Container>
      <Flex
        style={{ minHeight: '100vh' }}
        flexDirection={'column'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Logo size={'lg'} />
        <VStack spacing={4} align="stretch">
          <Center>
            <Button onClick={() => signIn()}>Sign in</Button>
          </Center>
        </VStack>
      </Flex>
    </Container>
  )
}

export default LoginPage
