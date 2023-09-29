import React from 'react'
import { signIn } from 'next-auth/react'
import {
  Button,
  Center,
  Container,
  Flex,
  Heading,
  VStack,
} from '@chakra-ui/react'

export const LoginPage = () => {
  return (
    <Container>
      <Flex
        style={{ minHeight: '100vh' }}
        flexDirection={'column'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <VStack spacing={4} align="stretch">
          <Heading as="h1" size="2xl" noOfLines={1}>
            Carbie
          </Heading>
          <Center>
            <Button onClick={() => signIn()}>Sign in</Button>
          </Center>
        </VStack>
      </Flex>
    </Container>
  )
}

export default LoginPage
