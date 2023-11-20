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
  const [noOfServings, setNoOfServings] = useState<string>('')
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
    if (ingredient && parseFloat(qty) > 0 && qtyMode === 'grams') {
      return total + parseFloat(qty)
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

  const finalWeight =
    totalWeight.length > 0 ? totalWeight : calculatedWeightTotal.toString()

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
          <Flex alignItems={'center'} pb={1}>
            <Grid
              gap={'0.5em'}
              templateColumns={'auto 1fr'}
              alignItems={'center'}
              width={'100%'}
            >
              <GridItem>
                <Heading as="h5" noOfLines={1} size={'sm'}>
                  Name
                </Heading>
              </GridItem>
              <GridItem>
                <Input
                  minWidth={isLargerThan800 ? '450px' : undefined}
                  width={'100%'}
                />
              </GridItem>
            </Grid>
          </Flex>
          <Heading as="h5" noOfLines={1} size={'sm'}>
            <Box mb={2}>Ingredients/Foods</Box>
          </Heading>
          {ingredientList.length > 0 && (
            <Grid gap={'0.5em'}>
              {ingredientList.map((i) => (
                <GridItem key={`mealIngredient_${i.ingredient.id}`}>
                  <MealIngredient
                    id={`mealIngredient_${i.ingredient.id}`}
                    mode={'modify'}
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
                        Misc carbs
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
                    templateColumns={'1fr 80px'}
                    alignItems={'center'}
                  >
                    <GridItem>
                      <Heading as="h5" noOfLines={1} size={'sm'}>
                        No. of servings
                      </Heading>
                    </GridItem>
                    <GridItem>
                      <Input
                        value={noOfServings}
                        onChange={(e) => setNoOfServings(e.target.value)}
                      />
                    </GridItem>
                  </Grid>
                </Flex>
                <Flex justifyContent={'flex-end'} alignItems={'center'} pt={1}>
                  <Grid
                    gap={'0.5em'}
                    templateColumns={'1fr 120px'}
                    alignItems={'center'}
                  >
                    <GridItem>
                      <Heading as="h5" noOfLines={1} size={'sm'}>
                        Total weight
                      </Heading>
                    </GridItem>
                    <GridItem>
                      <InputGroup>
                        <Input
                          value={finalWeight}
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
                <Heading as={'h3'} size={'sm'}>
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
                <Heading as={'h3'} size={'sm'}>
                  Total carbs in meal: {carbTotal.toFixed(1)}g/c
                </Heading>
              </Flex>
              {parseFloat(noOfServings) > 0 && (
                <>
                  <Flex
                    justifyContent={'flex-end'}
                    alignItems={'center'}
                    pt={3}
                  >
                    <Heading as={'h3'} size={'sm'}>
                      Serving size:{' '}
                      {(
                        parseFloat(finalWeight) / parseFloat(noOfServings)
                      ).toFixed(1)}
                      g
                    </Heading>
                  </Flex>
                  <Flex
                    justifyContent={'flex-end'}
                    alignItems={'center'}
                    pt={3}
                  >
                    <Heading as={'h3'} size={'sm'}>
                      Total carbs per serving:{' '}
                      {(carbTotal / parseFloat(noOfServings)).toFixed(1)}g/c
                    </Heading>
                  </Flex>
                </>
              )}
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
          <Button
            mr={3}
            onClick={() => {
              window.print()
            }}
          >
            Print
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
