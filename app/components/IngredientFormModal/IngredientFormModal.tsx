import React, { useCallback, useEffect, useState } from 'react'
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
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputRightElement,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useMediaQuery,
  useToast,
  Heading,
  Textarea,
  Checkbox,
  Box,
} from '@chakra-ui/react'

import styles from './ingredientFormModal.module.scss'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Ingredient } from '@prisma/client'
import { VendorAutocomplete } from '@/app/components/IngredientFormModal/VendorAutocomplete/VendorAutocomplete'

type Props = {
  isOpen: boolean
  onClose: () => void
  mode: 'add' | 'edit'
  ingredient?: Ingredient
}

export const IngredientFormModal = ({
  isOpen,
  onClose,
  mode,
  ingredient,
}: Props) => {
  const queryClient = useQueryClient()
  const toast = useToast()
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)')

  const [isPristine, setIsPristine] = useState(true)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const [name, setName] = useState(ingredient ? ingredient.name : '')
  const [brand, setBrand] = useState(ingredient ? ingredient.brand_vendor : '')
  const [carbsPer100g, setCarbsPer100g] = useState<string | undefined>(
    ingredient?.carbs_per_100g.toString() ?? '',
  )
  const [carbsPerServe, setCarbsPerServe] = useState<string | undefined>(
    ingredient?.carbs_per_serve?.toString() ?? undefined,
  )
  const [energyPer100g, setEnergyPer100g] = useState<string | undefined>(
    ingredient?.energy_per_100g?.toString() ?? undefined,
  )
  const [proteinPer100g, setProteinPer100g] = useState<string | undefined>(
    ingredient?.protein_per_100g?.toString() ?? undefined,
  )
  const [fatPer100g, setFatPer100g] = useState<string | undefined>(
    ingredient?.fat_per_100g?.toString() ?? undefined,
  )
  const [saturatedFatPer100g, setSaturatedFatPer100g] = useState<
    string | undefined
  >(ingredient?.saturated_fat_per_100g?.toString() ?? undefined)
  const [sugarPer100g, setSugarPer100g] = useState<string | undefined>(
    ingredient?.sugar_per_100g?.toString() ?? undefined,
  )
  const [sodiumPer100g, setSodiumPer100g] = useState<string | undefined>(
    ingredient?.sodium_per_100g?.toString() ?? undefined,
  )
  const [fibrePer100g, setFibrePer100g] = useState<string | undefined>(
    ingredient?.fibre_per_100g?.toString() ?? undefined,
  )
  const [alcoholPer100g, setAlcoholPer100g] = useState<string | undefined>(
    ingredient?.alcohol_per_100g?.toString() ?? undefined,
  )
  const [caffeinePer100g, setCaffeinePer100g] = useState<string | undefined>(
    ingredient?.caffeine_per_100g?.toString() ?? undefined,
  )
  const [energyPerServe, setEnergyPerServe] = useState<string | undefined>(
    ingredient?.energy_per_serve?.toString() ?? undefined,
  )
  const [proteinPerServe, setProteinPerServe] = useState<string | undefined>(
    ingredient?.protein_per_serve?.toString() ?? undefined,
  )
  const [fatPerServe, setFatPerServe] = useState<string | undefined>(
    ingredient?.fat_per_serve?.toString() ?? undefined,
  )
  const [saturatedFatPerServe, setSaturatedFatPerServe] = useState<
    string | undefined
  >(ingredient?.saturated_fat_per_serve?.toString() ?? undefined)
  const [sugarPerServe, setSugarPerServe] = useState<string | undefined>(
    ingredient?.sugar_per_serve?.toString() ?? undefined,
  )
  const [sodiumPerServe, setSodiumPerServe] = useState<string | undefined>(
    ingredient?.sodium_per_serve?.toString() ?? undefined,
  )
  const [fibrePerServe, setFibrePerServe] = useState<string | undefined>(
    ingredient?.fibre_per_serve?.toString() ?? undefined,
  )
  const [alcoholPerServe, setAlcoholPerServe] = useState<string | undefined>(
    ingredient?.alcohol_per_serve?.toString() ?? undefined,
  )
  const [caffeinePerServe, setCaffeinePerServe] = useState<string | undefined>(
    ingredient?.caffeine_per_serve?.toString() ?? undefined,
  )

  const [servingSizeUnits, setServingSizeUnits] = useState<string | undefined>(
    ingredient?.serving_size_units?.toString() ?? undefined,
  )

  const [servingSizeGrams, setServingSizeGrams] = useState<string | undefined>(
    ingredient?.serving_size_grams?.toString() ?? undefined,
  )

  const [notes, setNotes] = useState<string | undefined>(
    ingredient?.notes ?? undefined,
  )

  const [isGeneric, setIsGeneric] = useState(ingredient?.is_generic ?? false)

  const [isSaving, setIsSaving] = useState(false)

  const { data: remoteValidation, refetch: revalidateAlreadyExists } =
    useQuery<{ isValid: boolean }>({
      queryKey: ['validateIngredient'],
      queryFn: async () =>
        await axios
          .post(`/api/ingredients/validate`, {
            name,
            brand,
          })
          .then((res) => res.data),
      enabled: false,
    })

  const getValidationErrors = useCallback(() => {
    const errors: string[] = []
    if (
      !name ||
      name.length === 0 ||
      (mode === 'add' && !remoteValidation?.isValid)
    )
      errors.push('name')
    if (
      !brand ||
      brand.length === 0 ||
      (mode === 'add' && !remoteValidation?.isValid)
    )
      errors.push('brand')
    if (!carbsPer100g || carbsPer100g.length === 0) errors.push('carbsPer100g')

    return errors
  }, [name, brand, mode, carbsPer100g, remoteValidation])

  useEffect(() => {
    if (
      mode === 'add' &&
      !isPristine &&
      name.length > 0 &&
      brand.length > 0 &&
      name.trim() !== '' &&
      brand.trim() !== ''
    )
      revalidateAlreadyExists()
    const errors = getValidationErrors()
    if (!isPristine) setValidationErrors(errors)
  }, [
    isPristine,
    name,
    brand,
    mode,
    carbsPer100g,
    remoteValidation,
    getValidationErrors,
    revalidateAlreadyExists,
  ])

  const resetForm = () => {
    if (mode === 'add') {
      setName('')
      setBrand('')
      setCarbsPer100g('')
      setEnergyPer100g('')
      setProteinPer100g('')
      setFatPer100g('')
      setSaturatedFatPer100g('')
      setSugarPer100g('')
      setSodiumPer100g('')
      setFibrePer100g('')
      setAlcoholPer100g('')
      setCaffeinePer100g('')

      setCarbsPerServe('')
      setEnergyPerServe('')
      setProteinPerServe('')
      setFatPerServe('')
      setSaturatedFatPerServe('')
      setSugarPerServe('')
      setSodiumPerServe('')
      setFibrePerServe('')
      setAlcoholPerServe('')
      setCaffeinePerServe('')
      setServingSizeGrams('')
      setServingSizeUnits('')

      setNotes('')
      setIsGeneric(false)

      setIsPristine(true)
      setValidationErrors([])
    }
  }

  const addIngredient = useMutation({
    mutationFn: () => {
      setIsSaving(true)
      return axios.post('/api/ingredients', {
        name,
        brand,
        carbsPer100g,
        energyPer100g,
        proteinPer100g,
        fatPer100g,
        saturatedFatPer100g,
        sugarPer100g,
        sodiumPer100g,
        fibrePer100g,
        alcoholPer100g,
        caffeinePer100g,
        carbsPerServe,
        energyPerServe,
        proteinPerServe,
        fatPerServe,
        saturatedFatPerServe,
        sugarPerServe,
        sodiumPerServe,
        fibrePerServe,
        alcoholPerServe,
        caffeinePerServe,
        servingSizeUnits,
        servingSizeGrams,
        notes,
        isGeneric,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchIngredients'] })
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

  const saveIngredient = useMutation({
    mutationFn: () => {
      setIsSaving(true)
      return axios.patch('/api/ingredients', {
        id: ingredient?.id,
        name,
        brand,
        carbsPer100g,
        energyPer100g,
        proteinPer100g,
        fatPer100g,
        saturatedFatPer100g,
        sugarPer100g,
        sodiumPer100g,
        fibrePer100g,
        alcoholPer100g,
        caffeinePer100g,
        carbsPerServe,
        energyPerServe,
        proteinPerServe,
        fatPerServe,
        saturatedFatPerServe,
        sugarPerServe,
        sodiumPerServe,
        fibrePerServe,
        alcoholPerServe,
        caffeinePerServe,
        servingSizeUnits,
        servingSizeGrams,
        notes,
        isGeneric,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchIngredients'] })
      queryClient.invalidateQueries({
        queryKey: ['getIngredient', ingredient?.id],
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
        <ModalHeader>{mode === 'add' ? 'Add' : 'Edit'} Food</ModalHeader>
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
              <FormErrorMessage>
                {mode === 'add' && !remoteValidation?.isValid
                  ? 'Ingredient with this name and brand/vendor already exists'
                  : 'Specify a name for the ingredient'}
              </FormErrorMessage>
            )}
          </FormControl>
          <Grid
            templateColumns={isLargerThan800 ? '1fr 250px' : '100%'}
            alignItems={'flex-start'}
            gap={'1em'}
          >
            <GridItem>
              <FormControl
                isRequired
                isInvalid={validationErrors.indexOf('brand') !== -1}
              >
                <FormLabel className={styles.formLabel}>Brand/Vendor</FormLabel>
                <VendorAutocomplete
                  onSelect={(v) => {
                    setBrand(v)
                  }}
                  value={brand}
                />
                {validationErrors.indexOf('brand') !== -1 && (
                  <FormErrorMessage>
                    {mode === 'add' && !remoteValidation?.isValid
                      ? 'Ingredient with this name and brand/vendor already exists'
                      : 'Specify a brand/vendor for the ingredient'}
                  </FormErrorMessage>
                )}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl
                isRequired
                isInvalid={validationErrors.indexOf('carbsPer100g') !== -1}
              >
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
                {validationErrors.indexOf('carbsPer100g') !== -1 && (
                  <FormErrorMessage>Specify carbs per 100g/ml</FormErrorMessage>
                )}
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
          <Heading as="h5" noOfLines={1} size={'sm'} mt={4}>
            <strong>Additional info</strong>
          </Heading>
          <Tabs>
            <TabList>
              <Tab>
                <strong>Per 100g</strong>
              </Tab>
              <Tab>
                <strong>Per Serving</strong>
              </Tab>
              <Tab>
                <strong>Misc</strong>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div className={styles.additionalInfo}>
                  <FormControl>
                    <Flex alignItems={'center'}>
                      <FormLabel className={styles.formLabel}>Energy</FormLabel>
                      <InputGroup>
                        <Input
                          type={'number'}
                          value={energyPer100g}
                          onChange={(e) => {
                            setEnergyPer100g(e.target.value)
                          }}
                          placeholder={'eg. 100'}
                        />
                        <InputRightElement>kJ</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <Flex alignItems={'center'}>
                      <FormLabel className={styles.formLabel}>
                        Protein
                      </FormLabel>
                      <InputGroup>
                        <Input
                          type={'number'}
                          value={proteinPer100g}
                          onChange={(e) => {
                            setProteinPer100g(e.target.value)
                          }}
                          placeholder={'eg. 25'}
                        />
                        <InputRightElement>g</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <Flex alignItems={'center'}>
                      <FormLabel className={styles.formLabel}>Fat</FormLabel>
                      <InputGroup>
                        <Input
                          type={'number'}
                          value={fatPer100g}
                          onChange={(e) => {
                            setFatPer100g(e.target.value)
                          }}
                          placeholder={'eg. 30'}
                        />
                        <InputRightElement>g</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <Flex alignItems={'center'}>
                      <FormLabel className={styles.formLabel}>
                        Saturated Fat
                      </FormLabel>
                      <InputGroup>
                        <Input
                          type={'number'}
                          value={saturatedFatPer100g}
                          onChange={(e) => {
                            setSaturatedFatPer100g(e.target.value)
                          }}
                          placeholder={'eg. 30'}
                        />
                        <InputRightElement>g</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <Flex alignItems={'center'}>
                      <FormLabel className={styles.formLabel}>Sugar</FormLabel>
                      <InputGroup>
                        <Input
                          type={'number'}
                          value={sugarPer100g}
                          onChange={(e) => {
                            setSugarPer100g(e.target.value)
                          }}
                          placeholder={'eg. 25'}
                        />
                        <InputRightElement>g</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <Flex alignItems={'center'}>
                      <FormLabel className={styles.formLabel}>Sodium</FormLabel>
                      <InputGroup>
                        <Input
                          type={'number'}
                          value={sodiumPer100g}
                          onChange={(e) => {
                            setSodiumPer100g(e.target.value)
                          }}
                          placeholder={'eg. 100'}
                        />
                        <InputRightElement>mg</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <Flex alignItems={'center'}>
                      <FormLabel className={styles.formLabel}>Fibre</FormLabel>
                      <InputGroup>
                        <Input
                          type={'number'}
                          value={fibrePer100g}
                          onChange={(e) => {
                            setFibrePer100g(e.target.value)
                          }}
                          placeholder={'eg. 25'}
                        />
                        <InputRightElement>g</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <Flex alignItems={'center'}>
                      <FormLabel className={styles.formLabel}>
                        Alcohol
                      </FormLabel>
                      <InputGroup>
                        <Input
                          type={'number'}
                          value={alcoholPer100g}
                          onChange={(e) => {
                            setAlcoholPer100g(e.target.value)
                          }}
                          placeholder={'eg. 25'}
                        />
                        <InputRightElement>g</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <Flex alignItems={'center'}>
                      <FormLabel className={styles.formLabel}>
                        Caffeine
                      </FormLabel>
                      <InputGroup>
                        <Input
                          type={'number'}
                          value={caffeinePer100g}
                          onChange={(e) => {
                            setCaffeinePer100g(e.target.value)
                          }}
                          placeholder={'eg. 25'}
                        />
                        <InputRightElement>g</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </FormControl>
                </div>
              </TabPanel>
              <TabPanel>
                <div className={styles.additionalInfo}>
                  <FormControl>
                    <Flex alignItems={'center'}>
                      <FormLabel className={styles.formLabel}>Carbs</FormLabel>
                      <InputGroup>
                        <Input
                          type={'number'}
                          value={carbsPerServe}
                          onChange={(e) => {
                            setCarbsPerServe(e.target.value)
                          }}
                          placeholder={'eg. 15'}
                        />
                        <InputRightElement>g</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <Flex alignItems={'center'}>
                      <FormLabel className={styles.formLabel}>Energy</FormLabel>
                      <InputGroup>
                        <Input
                          type={'number'}
                          value={energyPerServe}
                          onChange={(e) => {
                            setEnergyPerServe(e.target.value)
                          }}
                          placeholder={'eg. 100'}
                        />
                        <InputRightElement>kJ</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <Flex alignItems={'center'}>
                      <FormLabel className={styles.formLabel}>
                        Protein
                      </FormLabel>
                      <InputGroup>
                        <Input
                          type={'number'}
                          value={proteinPerServe}
                          onChange={(e) => {
                            setProteinPerServe(e.target.value)
                          }}
                          placeholder={'eg. 25'}
                        />
                        <InputRightElement>g</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <Flex alignItems={'center'}>
                      <FormLabel className={styles.formLabel}>Fat</FormLabel>
                      <InputGroup>
                        <Input
                          type={'number'}
                          value={fatPerServe}
                          onChange={(e) => {
                            setFatPerServe(e.target.value)
                          }}
                          placeholder={'eg. 30'}
                        />
                        <InputRightElement>g</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <Flex alignItems={'center'}>
                      <FormLabel className={styles.formLabel}>
                        Saturated Fat
                      </FormLabel>
                      <InputGroup>
                        <Input
                          type={'number'}
                          value={saturatedFatPerServe}
                          onChange={(e) => {
                            setSaturatedFatPerServe(e.target.value)
                          }}
                          placeholder={'eg. 30'}
                        />
                        <InputRightElement>g</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <Flex alignItems={'center'}>
                      <FormLabel className={styles.formLabel}>Sugar</FormLabel>
                      <InputGroup>
                        <Input
                          type={'number'}
                          value={sugarPerServe}
                          onChange={(e) => {
                            setSugarPerServe(e.target.value)
                          }}
                          placeholder={'eg. 25'}
                        />
                        <InputRightElement>g</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <Flex alignItems={'center'}>
                      <FormLabel className={styles.formLabel}>Sodium</FormLabel>
                      <InputGroup>
                        <Input
                          type={'number'}
                          value={sodiumPerServe}
                          onChange={(e) => {
                            setSodiumPerServe(e.target.value)
                          }}
                          placeholder={'eg. 100'}
                        />
                        <InputRightElement>mg</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <Flex alignItems={'center'}>
                      <FormLabel className={styles.formLabel}>Fibre</FormLabel>
                      <InputGroup>
                        <Input
                          type={'number'}
                          value={fibrePerServe}
                          onChange={(e) => {
                            setFibrePerServe(e.target.value)
                          }}
                          placeholder={'eg. 25'}
                        />
                        <InputRightElement>g</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <Flex alignItems={'center'}>
                      <FormLabel className={styles.formLabel}>
                        Alcohol
                      </FormLabel>
                      <InputGroup>
                        <Input
                          type={'number'}
                          value={alcoholPerServe}
                          onChange={(e) => {
                            setAlcoholPerServe(e.target.value)
                          }}
                          placeholder={'eg. 25'}
                        />
                        <InputRightElement>g</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <Flex alignItems={'center'}>
                      <FormLabel className={styles.formLabel}>
                        Caffeine
                      </FormLabel>
                      <InputGroup>
                        <Input
                          type={'number'}
                          value={caffeinePerServe}
                          onChange={(e) => {
                            setCaffeinePerServe(e.target.value)
                          }}
                          placeholder={'eg. 25'}
                        />
                        <InputRightElement>g</InputRightElement>
                      </InputGroup>
                    </Flex>
                  </FormControl>
                </div>
              </TabPanel>
              <TabPanel>
                <FormControl>
                  <Flex alignItems={'center'}>
                    <FormLabel className={styles.formLabel}>Notes</FormLabel>
                    <Textarea
                      value={notes}
                      onChange={(e) => {
                        setNotes(e.target.value)
                      }}
                      placeholder={'Any comments and notes'}
                    />
                  </Flex>
                </FormControl>
                <FormControl>
                  <Box pt={4}>
                    <Checkbox
                      isChecked={isGeneric}
                      onChange={(e) => setIsGeneric(e.target.checked)}
                    >
                      This is a standard/generic version of the item
                    </Checkbox>
                  </Box>
                </FormControl>
              </TabPanel>
            </TabPanels>
          </Tabs>
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
                const errors = getValidationErrors()
                if (errors.length > 0) {
                  setIsPristine(false)
                } else {
                  addIngredient.mutate()
                }
              }}
            >
              {isSaving ? 'Adding...' : 'Add'}
            </Button>
          ) : (
            <Button
              disabled={isSaving}
              colorScheme="blue"
              onClick={() => {
                const errors = getValidationErrors()
                if (errors.length > 0) {
                  setIsPristine(false)
                } else {
                  saveIngredient.mutate()
                }
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
