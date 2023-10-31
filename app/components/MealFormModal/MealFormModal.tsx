import React, { useState } from 'react'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal'
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  useMediaQuery,
} from '@chakra-ui/react'

import styles from './mealFormModal.module.scss'
import { MealWithRelations } from '@/pages/api/meals/getMeals'
import {
  MealIngredient,
  MealIngredientProps,
} from '@/app/components/MealFormModal/MealIngredientForm/MealIngredient'
import { Ingredient } from '@prisma/client'

type Props = {
  isOpen: boolean
  onClose: () => void
  mode: 'add' | 'edit'
  meal?: MealWithRelations
}

export const MealFormModal = ({ isOpen, onClose }: Props) => {
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)')
  const [ingredientList, setIngredientList] = useState<MealIngredientProps[]>(
    [],
  )

  const carbTotal = ingredientList.reduce((total, current) => {
    const { ingredient, qty, qtyMode } = current
    if (
      ingredient &&
      ingredient.carbs_per_100g &&
      qty > 0 &&
      qtyMode === 'grams'
    ) {
      return total + (ingredient.carbs_per_100g * qty) / 100
    }

    if (
      ingredient &&
      ingredient.carbs_per_serve &&
      qty > 0 &&
      qtyMode === 'units'
    ) {
      return total + ingredient.carbs_per_serve * qty
    }

    return total
  }, 0)

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose()
      }}
      size={isLargerThan800 ? '2xl' : 'full'}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Meal Calculator</ModalHeader>
        <ModalCloseButton />
        <ModalBody className={styles.modalBody}>
          <Heading as="h5" noOfLines={1} size={'sm'} mt={4}>
            <Box mb={2}>Ingredients/Foods</Box>
          </Heading>
          {ingredientList.length > 0 && (
            <Grid gap={'0.5em'}>
              {ingredientList.map((i) => (
                <GridItem key={`mealIngredient_${i.ingredient.id}`}>
                  <MealIngredient
                    id={`mealIngredient_${i.ingredient.id}`}
                    mode={'edit'}
                    value={{
                      ingredient: i.ingredient,
                      qtyMode: i.qtyMode,
                      qty: i.qty,
                    }}
                    onChange={(payload) => {
                      setIngredientList(
                        ingredientList.map((i) =>
                          i.ingredient.id === payload.ingredient.id
                            ? payload
                            : i,
                        ),
                      )
                    }}
                    onRemove={(i: Ingredient) =>
                      setIngredientList(
                        ingredientList.filter(
                          (ii) => ii.ingredient.id !== i.id,
                        ),
                      )
                    }
                  />
                  {!isLargerThan800 && <Divider my={2} />}
                </GridItem>
              ))}
            </Grid>
          )}
          {carbTotal > 0 && (
            <>
              <Flex justifyContent={'flex-end'} alignItems={'center'}>
                <strong>Total: {carbTotal.toFixed(2)}g/c</strong>
              </Flex>
              <Divider my={4} />
            </>
          )}
          <MealIngredient
            id={`mealIngredient_add`}
            mode={'add'}
            onChange={(payload) => {
              setIngredientList([...ingredientList, payload])
            }}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={() => {
              onClose()
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}