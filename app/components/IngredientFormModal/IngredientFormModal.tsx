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

type Props = {
  isOpen: boolean
  onClose: () => void
}
export const IngredientFormModal = ({ isOpen, onClose }: Props) => {
  const queryClient = useQueryClient()
  const toast = useToast()

  const [isOptionalExpanded, setIsOptionalExpanded] = useState(false)
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [carbsPer100g, setCarbsPer100g] = useState<string | undefined>()
  const [carbsPerServe, setCarbsPerServe] = useState<string | undefined>()
  const [energy, setEnergy] = useState<string | undefined>()
  const [protein, setProtein] = useState<string | undefined>()
  const [fat, setFat] = useState<string | undefined>()
  const [sugar, setSugar] = useState<string | undefined>()
  const [fibre, setFibre] = useState<string | undefined>()
  const [alcohol, setAlcohol] = useState<string | undefined>()
  const [caffeine, setCaffeine] = useState<string | undefined>()
  const [averageServingUnits, setAverageServingUnits] = useState<
    string | undefined
  >()
  const [averageServingWeight, setAverageServingWeight] = useState<
    string | undefined
  >()

  const addIngredient = useMutation({
    mutationFn: () =>
      axios.post('/api/ingredients', {
        name,
        brand,
        carbsPer100g,
        carbsPerServe: isOptionalExpanded ? carbsPerServe : undefined,
        energy: isOptionalExpanded ? energy : undefined,
        protein: isOptionalExpanded ? protein : undefined,
        fat: isOptionalExpanded ? fat : undefined,
        sugar: isOptionalExpanded ? sugar : undefined,
        fibre: isOptionalExpanded ? fibre : undefined,
        alcohol: isOptionalExpanded ? alcohol : undefined,
        caffeine: isOptionalExpanded ? caffeine : undefined,
        averageServingUnits: isOptionalExpanded
          ? averageServingUnits
          : undefined,
        averageServingWeight: isOptionalExpanded
          ? averageServingWeight
          : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['getIngredients'])
      setName('')
      setBrand('')
      setCarbsPer100g(undefined)
      setCarbsPerServe(undefined)
      setEnergy(undefined)
      setProtein(undefined)
      setFat(undefined)
      setSugar(undefined)
      setFibre(undefined)
      setAlcohol(undefined)
      setCaffeine(undefined)
      setAverageServingUnits(undefined)
      setAverageServingWeight(undefined)

      toast({
        title: `${name} added!`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={isOptionalExpanded ? '2xl' : 'sm'}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Ingredient</ModalHeader>
        <ModalCloseButton />
        <ModalBody className={styles.modalBody}>
          <FormControl>
            <Flex alignItems={'center'}>
              <FormLabel className={styles.formLabel}>Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={'eg. White bread'}
              />
            </Flex>
          </FormControl>
          <FormControl>
            <Flex alignItems={'center'}>
              <FormLabel className={styles.formLabel}>Brand/Vendor</FormLabel>
              <Input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder={"eg. Baker's Delight"}
              />
            </Flex>
          </FormControl>
          <FormControl>
            <Flex alignItems={'center'}>
              <FormLabel className={styles.formLabel}>Carbs per 100g</FormLabel>
              <InputGroup>
                <Input
                  type={'number'}
                  value={carbsPer100g}
                  onChange={(e) => setCarbsPer100g(e.target.value)}
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
            <strong>Additional info </strong>
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
                  <FormLabel className={styles.formLabel}>
                    Carbs per serve
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type={'number'}
                      value={carbsPerServe}
                      onChange={(e) => setCarbsPerServe(e.target.value)}
                      placeholder={'eg. 20'}
                    />
                    <InputRightElement>kj</InputRightElement>
                  </InputGroup>
                </Flex>
              </FormControl>
              <FormControl>
                <Flex alignItems={'center'}>
                  <FormLabel className={styles.formLabel}>Energy</FormLabel>
                  <InputGroup>
                    <Input
                      type={'number'}
                      value={energy}
                      onChange={(e) => setEnergy(e.target.value)}
                      placeholder={'eg. 100'}
                    />
                    <InputRightElement>kj</InputRightElement>
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
                      onChange={(e) => setProtein(e.target.value)}
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
                      onChange={(e) => setFat(e.target.value)}
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
                      onChange={(e) => setSugar(e.target.value)}
                      placeholder={'eg. 25'}
                    />
                    <InputRightElement>g</InputRightElement>
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
                      onChange={(e) => setFibre(e.target.value)}
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
                      onChange={(e) => setAlcohol(e.target.value)}
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
                      onChange={(e) => setCaffeine(e.target.value)}
                      placeholder={'eg. 25'}
                    />
                    <InputRightElement>g</InputRightElement>
                  </InputGroup>
                </Flex>
              </FormControl>
              <FormControl>
                <Flex alignItems={'center'}>
                  <FormLabel className={styles.formLabel}>
                    Avg units per serving
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type={'number'}
                      value={averageServingUnits}
                      onChange={(e) => setAverageServingUnits(e.target.value)}
                      placeholder={'eg. 25'}
                    />
                    <InputRightElement>g</InputRightElement>
                  </InputGroup>
                </Flex>
              </FormControl>
              <FormControl>
                <Flex alignItems={'center'}>
                  <FormLabel className={styles.formLabel}>
                    Avg weight per serving
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type={'number'}
                      value={averageServingWeight}
                      onChange={(e) => setAverageServingWeight(e.target.value)}
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
          <Button colorScheme="blue" onClick={() => addIngredient.mutate()}>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
