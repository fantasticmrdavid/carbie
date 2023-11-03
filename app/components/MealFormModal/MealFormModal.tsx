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
  Collapse,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  useMediaQuery,
} from '@chakra-ui/react'

import styles from './mealFormModal.module.scss'
import { MealWithRelations } from '@/pages/api/meals/getMeals'
import {
  MealIngredient,
  MealIngredientProps,
} from '@/app/components/MealFormModal/MealIngredientForm/MealIngredient'
import { Ingredient } from '@prisma/client'
import { PiCalculator } from 'react-icons/pi'
import { BiSolidChevronDown, BiSolidChevronRight } from 'react-icons/bi'

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
  const [isExtraExpanded, setIsExtraExpanded] = useState(false)
  const [miscCarbs, setMiscCarbs] = useState<string>('')
  const [totalWeight, setTotalWeight] = useState<string>('')

  const carbTotal =
    (parseFloat(miscCarbs) || 0) +
    ingredientList.reduce((total, current) => {
      const { ingredient, qty, qtyMode } = current
      if (
        ingredient &&
        ingredient.carbs_per_100g &&
        parseFloat(qty) > 0 &&
        qtyMode === 'grams'
      ) {
        return total + (ingredient.carbs_per_100g * parseFloat(qty)) / 100
      }

      if (
        ingredient &&
        ingredient.carbs_per_serve &&
        ingredient.serving_size_units &&
        parseFloat(qty) > 0 &&
        qtyMode === 'units'
      ) {
        return (
          total +
          (ingredient.carbs_per_serve / ingredient.serving_size_units) *
            parseFloat(qty)
        )
      }

      return total
    }, 0)

  const calculatedWeightTotal = ingredientList.reduce((total, current) => {
    const { ingredient, qty, qtyMode } = current
    if (
      ingredient &&
      ingredient.carbs_per_100g &&
      parseFloat(qty) > 0 &&
      qtyMode === 'grams'
    ) {
      return parseFloat(qty)
    }

    if (
      ingredient &&
      ingredient.serving_size_grams &&
      parseFloat(qty) > 0 &&
      qtyMode === 'units'
    ) {
      return total + ingredient.serving_size_grams * parseFloat(qty)
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
        <ModalHeader>
          <Flex gap={'0.15em'} alignItems={'center'}>
            <PiCalculator />
            Meal Calculator
          </Flex>
        </ModalHeader>
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
          {ingredientList.length > 0 && (
            <>
              <Box
                style={{ cursor: 'pointer' }}
                onClick={() => setIsExtraExpanded(!isExtraExpanded)}
                mt={2}
              >
                <Heading as="h5" noOfLines={1} size={'sm'}>
                  <Flex alignItems={'center'}>
                    Extra Details{' '}
                    {isExtraExpanded ? (
                      <BiSolidChevronDown />
                    ) : (
                      <BiSolidChevronRight />
                    )}
                  </Flex>
                </Heading>
              </Box>
              <Collapse in={isExtraExpanded}>
                <Flex justifyContent={'flex-end'} alignItems={'center'} pt={1}>
                  <Grid
                    gap={'0.5em'}
                    templateColumns={'1fr 80px'}
                    alignItems={'center'}
                  >
                    <GridItem>
                      <Heading as="h5" noOfLines={1} size={'sm'}>
                        Misc carbs:
                      </Heading>
                    </GridItem>
                    <GridItem>
                      <InputGroup>
                        <Input
                          value={miscCarbs}
                          onChange={(e) => setMiscCarbs(e.target.value)}
                        />
                        <InputRightElement>g</InputRightElement>
                      </InputGroup>
                    </GridItem>
                  </Grid>
                </Flex>
                <Flex justifyContent={'flex-end'} alignItems={'center'} pt={1}>
                  <Grid
                    gap={'0.5em'}
                    templateColumns={'1fr 100px'}
                    alignItems={'center'}
                  >
                    <GridItem>
                      <Heading as="h5" noOfLines={1} size={'sm'}>
                        Total weight:
                      </Heading>
                    </GridItem>
                    <GridItem>
                      <InputGroup>
                        <Input
                          defaultValue={calculatedWeightTotal.toString()}
                          onChange={(e) => setTotalWeight(e.target.value)}
                        />
                        <InputRightElement>g</InputRightElement>
                      </InputGroup>
                    </GridItem>
                  </Grid>
                </Flex>
              </Collapse>
            </>
          )}
          {carbTotal > 0 && (
            <>
              <Divider mt={2} />
              <Flex justifyContent={'flex-end'} alignItems={'center'} pt={3}>
                <Heading as={'h3'} size={'md'}>
                  Carb % of meal:{' '}
                  {(
                    (carbTotal /
                      (parseFloat(totalWeight.length > 0 ? totalWeight : '0') ||
                        calculatedWeightTotal)) *
                    100
                  ).toFixed(1)}
                  %
                </Heading>
              </Flex>
              <Flex justifyContent={'flex-end'} alignItems={'center'} pt={3}>
                <Heading as={'h3'} size={'md'}>
                  Total carbs: {carbTotal.toFixed(1)}g/c
                </Heading>
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
