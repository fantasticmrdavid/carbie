import React from 'react'
import { useSession } from 'next-auth/react'
import { Button, Center, Container, useDisclosure } from '@chakra-ui/react'
import { IngredientFormModal } from '@/app/components/IngredientFormModal/IngredientFormModal'
import { IngredientSearch } from '@/app/components/IngredientSearch/IngredientSearch'
import { Logo } from '@/app/components/Logo/Logo'
import styles from './styles.module.scss'

const IndexPage = () => {
  const { data: session } = useSession()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Container className={styles.container}>
      <Center>
        <Logo size={'lg'} />
      </Center>
      <Center>
        <IngredientSearch />
      </Center>
      {session && session.user && (
        <Center>
          <Button onClick={onOpen} colorScheme={'blue'}>
            Add Food
          </Button>
          <IngredientFormModal mode={'add'} isOpen={isOpen} onClose={onClose} />
        </Center>
      )}
    </Container>
  )
}

export default IndexPage
