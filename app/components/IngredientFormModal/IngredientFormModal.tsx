import React, { useEffect, useState } from 'react'
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
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react'

import styles from './ingredientFormModal.module.scss'
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from 'react-icons/ai'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
    i.energy ||
    i.fat ||
    i.alcohol ||
    i.caffeine ||
    i.fibre ||
    i.protein ||
    i.sugar ||
    i.sodium
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
  const [energy, setEnergy] = useState<string | undefined>(
    ingredient?.energy?.toString() || undefined,
  )
  const [protein, setProtein] = useState<string | undefined>(
    ingredient?.protein?.toString() || undefined,
  )
  const [fat, setFat] = useState<string | undefined>(
    ingredient?.fat?.toString() || undefined,
  )
  const [sugar, setSugar] = useState<string | undefined>(
    ingredient?.sugar?.toString() || undefined,
  )
  const [sodium, setSodium] = useState<string | undefined>(
    ingredient?.sodium?.toString() || undefined,
  )
  const [fibre, setFibre] = useState<string | undefined>(
    ingredient?.fibre?.toString() || undefined,
  )
  const [alcohol, setAlcohol] = useState<string | undefined>(
    ingredient?.alcohol?.toString() || undefined,
  )
  const [caffeine, setCaffeine] = useState<string | undefined>(
    ingredient?.caffeine?.toString() || undefined,
  )

  const getValidationErrors = () => {
    const errors: string[] = []
    if (!name || name.length === 0) errors.push('name')
    if (!brand || brand.length === 0) errors.push('brand')
    if (!carbsPer100g || carbsPer100g.length === 0) errors.push('carbsPer100g')

    return errors
  }

  useEffect(() => {
    const errors = getValidationErrors()
    if (!isPristine) setValidationErrors(errors)
  }, [isPristine, name, brand, carbsPer100g])

  const addIngredient = useMutation({
    mutationFn: () =>
      axios.post('/api/ingredients', {
        name,
        brand,
        carbsPer100g,
        energy: isOptionalExpanded ? energy : undefined,
        protein: isOptionalExpanded ? protein : undefined,
        fat: isOptionalExpanded ? fat : undefined,
        sugar: isOptionalExpanded ? sugar : undefined,
        sodium: isOptionalExpanded ? sodium : undefined,
        fibre: isOptionalExpanded ? fibre : undefined,
        alcohol: isOptionalExpanded ? alcohol : undefined,
        caffeine: isOptionalExpanded ? caffeine : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['searchIngredients'])
      setName('')
      setBrand('')
      setCarbsPer100g('')
      setEnergy('')
      setProtein('')
      setFat('')
      setSugar('')
      setSodium('')
      setFibre('')
      setAlcohol('')
      setCaffeine('')
      onClose()

      toast({
        title: `${name} added!`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      setIsPristine(true)
    },
    onError: (error) => {
      console.log('ERROR: ', error)
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
    mutationFn: () =>
      axios.patch('/api/ingredients', {
        id: ingredient?.id,
        name,
        brand,
        carbsPer100g,
        energy,
        protein,
        fat,
        sugar,
        sodium,
        fibre,
        alcohol,
        caffeine,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['searchIngredients'])
      setName('')
      setBrand('')
      setCarbsPer100g('')
      setEnergy('')
      setProtein('')
      setFat('')
      setSugar('')
      setSodium('')
      setFibre('')
      setAlcohol('')
      setCaffeine('')
      onClose()

      toast({
        title: `${name} updated!`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      setIsPristine(true)
    },
    onError: (error) => {
      console.log('ERROR: ', error)
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
      onClose={onClose}
      size={isOptionalExpanded ? '2xl' : 'sm'}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{mode === 'add' ? 'Add' : 'Edit'} Ingredient</ModalHeader>
        <ModalCloseButton />
        <ModalBody className={styles.modalBody}>
          <FormControl
            isRequired
            isInvalid={
              validationErrors.length > 0 &&
              validationErrors.indexOf('name') !== -1
            }
          >
            <Flex alignItems={'center'}>
              <FormLabel className={styles.formLabel}>Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                }}
                placeholder={'eg. White bread'}
              />
            </Flex>
          </FormControl>
          <FormControl isRequired>
            <Flex alignItems={'center'}>
              <FormLabel className={styles.formLabel}>Brand/Vendor</FormLabel>
              <VendorAutocomplete
                onSelect={(v) => {
                  setBrand(v)
                }}
                isInvalid={
                  validationErrors.length > 0 &&
                  validationErrors.indexOf('brand') !== -1
                }
                value={brand}
              />
            </Flex>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={
              validationErrors.length > 0 &&
              validationErrors.indexOf('carbsPer100g') !== -1
            }
          >
            <Flex alignItems={'center'}>
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
            </Flex>
          </FormControl>
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
                      value={energy}
                      onChange={(e) => {
                        setEnergy(e.target.value)
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
                      value={protein}
                      onChange={(e) => {
                        setProtein(e.target.value)
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
                      value={fat}
                      onChange={(e) => {
                        setFat(e.target.value)
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
                      value={sugar}
                      onChange={(e) => {
                        setSugar(e.target.value)
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
                      value={sodium}
                      onChange={(e) => {
                        setSodium(e.target.value)
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
                      value={fibre}
                      onChange={(e) => {
                        setFibre(e.target.value)
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
                      value={alcohol}
                      onChange={(e) => {
                        setAlcohol(e.target.value)
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
                      value={caffeine}
                      onChange={(e) => {
                        setCaffeine(e.target.value)
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
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          {mode === 'add' ? (
            <Button
              colorScheme="blue"
              onClick={() => {
                const errors = getValidationErrors()
                if (errors.length > 0) {
                  setIsPristine(false)
                } else {
                  addIngredient.mutate()
                }
              }}
            >
              Add
            </Button>
          ) : (
            <Button
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
              Save
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
