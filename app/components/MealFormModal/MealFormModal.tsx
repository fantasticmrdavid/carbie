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
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react'

import styles from './mealFormModal.module.scss'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
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

export const MealFormModal = ({ isOpen, onClose, mode, meal }: Props) => {
  const queryClient = useQueryClient()
  const toast = useToast()
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)')
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const [name, setName] = useState(meal ? meal.name : '')
  const [carbsPer100g, setCarbsPer100g] = useState<string | undefined>(
    meal?.carbs_per_100g?.toString() ?? '',
  )
  const [carbsPerServe, setCarbsPerServe] = useState<string | undefined>(
    meal?.carbs_per_serve?.toString() ?? undefined,
  )

  const [servingSizeUnits, setServingSizeUnits] = useState<string | undefined>(
    meal?.serving_size_units?.toString() ?? undefined,
  )

  const [servingSizeGrams, setServingSizeGrams] = useState<string | undefined>(
    meal?.serving_size_grams?.toString() ?? undefined,
  )

  const [ingredientList, setIngredientList] = useState<MealIngredientProps[]>(
    [],
  )

  const [notes, setNotes] = useState<string | undefined>(
    meal?.notes ?? undefined,
  )

  const [isSaving, setIsSaving] = useState(false)

  const resetForm = () => {
    if (mode === 'add') {
      setName('')
      setCarbsPer100g('')
      setCarbsPerServe('')
      setServingSizeGrams('')
      setServingSizeUnits('')

      setNotes('')
      setValidationErrors([])
    }
  }

  const addMeal = useMutation({
    mutationFn: () => {
      setIsSaving(true)
      return axios.post('/api/meals', {
        name,
        carbsPer100g,
        carbsPerServe,
        servingSizeUnits,
        servingSizeGrams,
        notes,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchMeals'] })
      setIsSaving(false)
      resetForm()
      onClose()

      toast({
        title: `${name} added!`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    },
    onError: (error) => {
      console.log('ERROR: ', error)
      setIsSaving(false)
      toast({
        title: 'Error adding food',
        description: 'Check the console for details',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    },
  })

  const saveMeal = useMutation({
    mutationFn: () => {
      setIsSaving(true)
      return axios.patch('/api/meals', {
        id: meal?.id,
        name,
        carbsPer100g,
        carbsPerServe,
        servingSizeUnits,
        servingSizeGrams,
        notes,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchMeals'] })
      queryClient.invalidateQueries({
        queryKey: ['getMeal', meal?.id],
      })
      setIsSaving(false)
      resetForm()
      onClose()

      toast({
        title: `${name} updated!`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    },
    onError: (error) => {
      console.log('ERROR: ', error)
      setIsSaving(false)
      toast({
        title: 'Error updating food',
        description: 'Check the console for details',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    },
  })

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
        resetForm()
      }}
      size={'2xl'}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{mode === 'add' ? 'Create' : 'Edit'} Meal</ModalHeader>
        <ModalCloseButton />
        <ModalBody className={styles.modalBody}>
          <FormControl
            isRequired
            isInvalid={validationErrors.indexOf('name') !== -1}
          >
            <FormLabel className={styles.formLabel}>Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
              placeholder={'eg. White bread'}
            />
            {validationErrors.indexOf('name') !== -1 && (
              <FormErrorMessage>Specify a name for the meal</FormErrorMessage>
            )}
          </FormControl>
          <Heading as="h5" noOfLines={1} size={'sm'} mt={4}>
            <Box mb={2}>Ingredients/Foods: {carbTotal.toFixed(2)}g/c</Box>
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
                </GridItem>
              ))}
            </Grid>
            <Divider my={4} />
            <MealIngredient
              id={`mealIngredient_add`}
              mode={'add'}
              onChange={(payload) => {
                console.log(payload)
                setIngredientList([...ingredientList, payload])
              }}
            />
          </Heading>
          <Grid
            templateColumns={isLargerThan800 ? '1fr 1fr 1fr' : '100%'}
            alignItems={'flex-start'}
            gap={'1em'}
          >
            <GridItem>
              <FormControl>
                <FormLabel className={styles.formLabel}>
                  Carbs per 100g/ml
                </FormLabel>
                <InputGroup>
                  <Input
                    type={'number'}
                    value={carbsPer100g}
                    onChange={(e) => {
                      setCarbsPer100g(e.target.value)
                    }}
                    placeholder={'eg. 15'}
                  />
                  <InputRightElement>g</InputRightElement>
                </InputGroup>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl
                isInvalid={validationErrors.indexOf('servingSizeUnits') !== -1}
              >
                <FormLabel className={styles.formLabel}>
                  Items per serve
                </FormLabel>
                <Input
                  type={'number'}
                  value={servingSizeUnits}
                  onChange={(e) => {
                    setServingSizeUnits(e.target.value)
                  }}
                  placeholder={'eg. 1'}
                />
                {validationErrors.indexOf('servingSizeUnits') !== -1 && (
                  <FormErrorMessage>
                    Specify number of items in a serve
                  </FormErrorMessage>
                )}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl
                isInvalid={validationErrors.indexOf('servingSizeGrams') !== -1}
              >
                <FormLabel className={styles.formLabel}>
                  Serving weight
                </FormLabel>
                <InputGroup>
                  <Input
                    type={'number'}
                    value={servingSizeGrams}
                    onChange={(e) => {
                      setServingSizeGrams(e.target.value)
                    }}
                    placeholder={'eg. 70'}
                  />
                  <InputRightElement>g</InputRightElement>
                </InputGroup>
                {validationErrors.indexOf('servingSizeGrams') !== -1 && (
                  <FormErrorMessage>Specify grams in a serve</FormErrorMessage>
                )}
              </FormControl>
            </GridItem>
          </Grid>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={() => {
              onClose()
              resetForm()
            }}
          >
            Cancel
          </Button>
          {mode === 'add' ? (
            <Button
              disabled={isSaving}
              colorScheme="blue"
              onClick={async () => {
                addMeal.mutate()
              }}
            >
              {isSaving ? 'Creating...' : 'Create'}
            </Button>
          ) : (
            <Button
              disabled={isSaving}
              colorScheme="blue"
              onClick={() => {
                saveMeal.mutate()
              }}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
