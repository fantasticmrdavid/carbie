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
  Collapse,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputRightElement,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react'

import styles from './ingredientFormModal.module.scss'
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from 'react-icons/ai'
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
const hasAdditionalInfo = (i: Ingredient) => {
  return !!(
    i.energy_per_100g ||
    i.fat_per_100g ||
    i.alcohol_per_100g ||
    i.caffeine_per_100g ||
    i.fibre_per_100g ||
    i.protein_per_100g ||
    i.sugar_per_100g ||
    i.sodium_per_100g
  )
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

  const [isOptionalExpanded, setIsOptionalExpanded] = useState(
    ingredient ? hasAdditionalInfo(ingredient) : false,
  )
  const [name, setName] = useState(ingredient ? ingredient.name : '')
  const [brand, setBrand] = useState(ingredient ? ingredient.brand_vendor : '')
  const [carbsPer100g, setCarbsPer100g] = useState<string | undefined>(
    ingredient?.carbs_per_100g.toString() || '',
  )
  const [energyPer100g, setEnergyPer100g] = useState<string | undefined>(
    ingredient?.energy_per_100g?.toString() || undefined,
  )
  const [proteinPer100g, setProteinPer100g] = useState<string | undefined>(
    ingredient?.protein_per_100g?.toString() || undefined,
  )
  const [fatPer100g, setFatPer100g] = useState<string | undefined>(
    ingredient?.fat_per_100g?.toString() || undefined,
  )
  const [saturatedFatPer100g, setSaturatedFatPer100g] = useState<
    string | undefined
  >(ingredient?.saturated_fat_per_100g?.toString() || undefined)
  const [sugarPer100g, setSugarPer100g] = useState<string | undefined>(
    ingredient?.sugar_per_100g?.toString() || undefined,
  )
  const [sodiumPer100g, setSodiumPer100g] = useState<string | undefined>(
    ingredient?.sodium_per_100g?.toString() || undefined,
  )
  const [fibrePer100g, setFibrePer100g] = useState<string | undefined>(
    ingredient?.fibre_per_100g?.toString() || undefined,
  )
  const [alcoholPer100g, setAlcoholPer100g] = useState<string | undefined>(
    ingredient?.alcohol_per_100g?.toString() || undefined,
  )
  const [caffeinePer100g, setCaffeinePer100g] = useState<string | undefined>(
    ingredient?.caffeine_per_100g?.toString() || undefined,
  )
  const [isSaving, setIsSaving] = useState(false)

  const { data: remoteValidation, refetch: revalidateAlreadyExists } =
    useQuery<{ isValid: boolean }>(
      ['validateIngredient'],
      async () =>
        await axios
          .post(`/api/ingredients/validate`, {
            name,
            brand,
          })
          .then((res) => res.data),
      { enabled: false },
    )

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
      (mode === 'add' && remoteValidation?.isValid)
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
      setIsOptionalExpanded(false)
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
        energyPer100g: isOptionalExpanded ? energyPer100g : undefined,
        proteinPer100g: isOptionalExpanded ? proteinPer100g : undefined,
        fatPer100g: isOptionalExpanded ? fatPer100g : undefined,
        saturatedFatPer100g: isOptionalExpanded
          ? saturatedFatPer100g
          : undefined,
        sugarPer100g: isOptionalExpanded ? sugarPer100g : undefined,
        sodiumPer100g: isOptionalExpanded ? sodiumPer100g : undefined,
        fibrePer100g: isOptionalExpanded ? fibrePer100g : undefined,
        alcoholPer100g: isOptionalExpanded ? alcoholPer100g : undefined,
        caffeinePer100g: isOptionalExpanded ? caffeinePer100g : undefined,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['searchIngredients'])
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
        title: 'Error adding ingredient',
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
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['searchIngredients'])
      queryClient.invalidateQueries(['getIngredient', ingredient?.id])
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
        title: 'Error updating ingredient',
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
        <ModalHeader>{mode === 'add' ? 'Add' : 'Edit'} Ingredient</ModalHeader>
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
                  isInvalid={validationErrors.indexOf('brand') !== -1}
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
          </Grid>
          <div
            className={styles.expandToggle}
            onClick={() => setIsOptionalExpanded(!isOptionalExpanded)}
          >
            <strong>Additional info (per 100g/ml)</strong>
            {isOptionalExpanded ? (
              <AiOutlineMinusSquare />
            ) : (
              <AiOutlinePlusSquare />
            )}
          </div>
          <Collapse in={isOptionalExpanded}>
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
                  <FormLabel className={styles.formLabel}>Protein</FormLabel>
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
                  <FormLabel className={styles.formLabel}>Alcohol</FormLabel>
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
                  <FormLabel className={styles.formLabel}>Caffeine</FormLabel>
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
          </Collapse>
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
