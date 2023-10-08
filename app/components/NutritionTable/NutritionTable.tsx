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
    energy_per_100g,
    protein_per_100g,
    fat_per_100g,
    saturated_fat_per_100g,
    sugar_per_100g,
    sodium_per_100g,
    fibre_per_100g,
    alcohol_per_100g,
    caffeine_per_100g,
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
                <strong>
                  {carbs_per_100g || carbs_per_100g === 0
                    ? `${carbs_per_100g}g`
                    : '-'}
                </strong>
              </Td>
            </Tr>
            <Tr>
              <Td>Sugar</Td>
              <Td isNumeric>
                {sugar_per_100g || sugar_per_100g === 0
                  ? `${sugar_per_100g}g`
                  : '-'}
              </Td>
            </Tr>
            <Tr>
              <Td>Sodium</Td>
              <Td isNumeric>
                {sodium_per_100g || sodium_per_100g === 0
                  ? `${sodium_per_100g}mg`
                  : '-'}
              </Td>
            </Tr>
            <Tr>
              <Td>Energy</Td>
              <Td isNumeric>
                {energy_per_100g || energy_per_100g === 0
                  ? `${energy_per_100g}kJ`
                  : '-'}
              </Td>
            </Tr>
            <Tr>
              <Td>Protein</Td>
              <Td isNumeric>
                {protein_per_100g || protein_per_100g === 0
                  ? `${protein_per_100g}g`
                  : '-'}
              </Td>
            </Tr>
            <Tr>
              <Td>Fat</Td>
              <Td isNumeric>
                {fat_per_100g || fat_per_100g === 0 ? `${fat_per_100g}g` : '-'}
              </Td>
            </Tr>
            <Tr>
              <Td>Saturated Fat</Td>
              <Td isNumeric>
                {saturated_fat_per_100g || saturated_fat_per_100g === 0
                  ? `${saturated_fat_per_100g}g`
                  : '-'}
              </Td>
            </Tr>
            <Tr>
              <Td>Fibre</Td>
              <Td isNumeric>
                {fibre_per_100g || fibre_per_100g === 0
                  ? `${fibre_per_100g}g`
                  : '-'}
              </Td>
            </Tr>
            <Tr>
              <Td>Alcohol</Td>
              <Td isNumeric>
                {alcohol_per_100g || alcohol_per_100g === 0
                  ? `${alcohol_per_100g}g`
                  : '-'}
              </Td>
            </Tr>
            <Tr>
              <Td>Caffeine</Td>
              <Td isNumeric>
                {caffeine_per_100g || caffeine_per_100g === 0
                  ? `${caffeine_per_100g}g`
                  : '-'}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  )
}
