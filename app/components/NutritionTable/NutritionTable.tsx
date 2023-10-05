import React from 'react'
import { Table, Tbody, Tr, Td, TableContainer, Heading } from '@chakra-ui/react'
import type { Ingredient } from '@prisma/client'

type Props = {
  ingredient: Ingredient
}

export const NutritionTable = (props: Props) => {
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
    <div>
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
              <Td isNumeric>
                <strong>{carbs_per_100g ? `${carbs_per_100g}g` : '-'}</strong>
              </Td>
            </Tr>
            <Tr>
              <Td>Sugar</Td>
              <Td isNumeric>{sugar ? `${sugar}g` : '-'}</Td>
            </Tr>
            <Tr>
              <Td>Sodium</Td>
              <Td isNumeric>{sodium ? `${sodium}mg` : '-'}</Td>
            </Tr>
            <Tr>
              <Td>Energy</Td>
              <Td isNumeric>{energy ? `${energy}kJ` : '-'}</Td>
            </Tr>
            <Tr>
              <Td>Protein</Td>
              <Td isNumeric>{protein ? `${protein}g` : '-'}</Td>
            </Tr>
            <Tr>
              <Td>Fat</Td>
              <Td isNumeric>{fat ? `${fat}g` : '-'}</Td>
            </Tr>
            <Tr>
              <Td>Fibre</Td>
              <Td isNumeric>{fibre ? `${fibre}g` : '-'}</Td>
            </Tr>
            <Tr>
              <Td>Alcohol</Td>
              <Td isNumeric>{alcohol ? `${alcohol}g` : '-'}</Td>
            </Tr>
            <Tr>
              <Td>Caffeine</Td>
              <Td isNumeric>{caffeine ? `${caffeine}g` : '-'}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  )
}
