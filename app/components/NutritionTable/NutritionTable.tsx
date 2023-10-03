import React from 'react'
import {
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Container,
  Heading,
} from '@chakra-ui/react'
import type { Ingredient } from '@prisma/client'

type NutritionTableProps = {
  ingredient: Ingredient
}

export const NutritionTable = (props: NutritionTableProps) => {
  const { ingredient } = props
  const {
    carbs_per_100g,
    energy,
    protein,
    fat,
    sugar,
    sodium,
    fibre,
    alcohol,
    caffeine,
  } = ingredient
  return (
    <Container>
      <Heading as="h5" noOfLines={1} size={'md'}>
        Nutrition information (per 100g)
      </Heading>
      <TableContainer>
        <Table size="sm">
          <Tbody>
            <Tr>
              <Td>
                <strong>Carbs</strong>
              </Td>
              <Td>
                <strong>{carbs_per_100g ? `${carbs_per_100g}g` : '-'}</strong>
              </Td>
            </Tr>
            <Tr>
              <Td>Sugar</Td>
              <Td>{sugar ? `${sugar}g` : '-'}</Td>
            </Tr>
            <Tr>
              <Td>Sodium</Td>
              <Td>{sodium ? `${sodium}mg` : '-'}</Td>
            </Tr>
            <Tr>
              <Td>Energy</Td>
              <Td>{energy ? `${energy}kJ` : '-'}</Td>
            </Tr>
            <Tr>
              <Td>Protein</Td>
              <Td>{protein ? `${protein}g` : '-'}</Td>
            </Tr>
            <Tr>
              <Td>Fat</Td>
              <Td>{fat ? `${fat}g` : '-'}</Td>
            </Tr>
            <Tr>
              <Td>Fibre</Td>
              <Td>{fibre ? `${fibre}g` : '-'}</Td>
            </Tr>
            <Tr>
              <Td>Alcohol</Td>
              <Td>{alcohol ? `${alcohol}g` : '-'}</Td>
            </Tr>
            <Tr>
              <Td>Caffeine</Td>
              <Td>{caffeine ? `${caffeine}g` : '-'}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  )
}
