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
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'

type Props = {
  isOpen: boolean
  onClose: () => void
}
export const IngredientFormModal = ({ isOpen, onClose }: Props) => {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [carbsPer100g, setCarbsPer100g] = useState<string | undefined>()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Ingredient</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <Flex alignItems={'center'}>
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={'eg. White bread'}
              />
            </Flex>
          </FormControl>
          <FormControl>
            <Flex alignItems={'center'}>
              <FormLabel>Brand/Vendor</FormLabel>
              <Input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder={"eg. Baker's Delight"}
              />
            </Flex>
          </FormControl>
          <FormControl>
            <Flex alignItems={'center'}>
              <FormLabel>Carbs per 100g</FormLabel>
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
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="ghost">Add</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
