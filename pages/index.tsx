import React from 'react'
import { useSession } from 'next-auth/react'
import LoginPage from '@/pages/login'
import { Button, Center, Container, useDisclosure } from '@chakra-ui/react'
import { IngredientFormModal } from '@/app/components/IngredientFormModal/IngredientFormModal'

const IndexPage = () => {
  const { data: session } = useSession()
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (!session?.user) {
    return <LoginPage />
  }

  return (
    <Container>
      <Center>
        <Button onClick={onOpen}>Add Ingredient</Button>
        <IngredientFormModal isOpen={isOpen} onClose={onClose} />
      </Center>
    </Container>
  )
}

export default IndexPage
