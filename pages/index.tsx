import React from 'react'
import { useSession } from 'next-auth/react'
import {
  Button,
  Center,
  Container,
  Flex,
  useDisclosure,
} from '@chakra-ui/react'
import { IngredientFormModal } from '@/app/components/IngredientFormModal/IngredientFormModal'
import { IngredientSearch } from '@/app/components/IngredientSearch/IngredientSearch'
import { Logo } from '@/app/components/Logo/Logo'
import styles from './styles.module.scss'
import { MealFormModal } from '@/app/components/MealFormModal/MealFormModal'
import { useRouter } from 'next/router'
import { PiCalculator } from 'react-icons/pi'
import { AiOutlinePlusCircle } from 'react-icons/ai'

const IndexPage = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const {
    isOpen: isIngredientModalOpen,
    onOpen: openIngredientModal,
    onClose: closeIngredientModal,
  } = useDisclosure()

  const {
    isOpen: isMealModalOpen,
    onOpen: openMealModal,
    onClose: closeMealModal,
  } = useDisclosure()

  return (
    <Container className={styles.container}>
      <Center>
        <Logo size={'lg'} />
      </Center>
      <Center>
        <IngredientSearch
          id={'home'}
          onChange={(i) => router.push(`/ingredient/${i.id}`)}
        />
      </Center>
      <Center gap={'1em'}>
        {session?.user && (
          <>
            <Button onClick={openIngredientModal} colorScheme={'blue'}>
              <Flex gap={'0.15em'} alignItems={'center'}>
                <AiOutlinePlusCircle />
                Add Food
              </Flex>
            </Button>
            <IngredientFormModal
              mode={'add'}
              isOpen={isIngredientModalOpen}
              onClose={closeIngredientModal}
            />
          </>
        )}
        <Button onClick={openMealModal} colorScheme={'blue'}>
          <Flex gap={'0.15em'} alignItems={'center'}>
            <PiCalculator />
            Meal Calculator
          </Flex>
        </Button>
        <MealFormModal
          mode={'add'}
          isOpen={isMealModalOpen}
          onClose={closeMealModal}
        />
      </Center>
    </Container>
  )
}

export default IndexPage
