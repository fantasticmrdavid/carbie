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
    saturated_fat,
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
                <strong>
                  {carbs_per_100g || carbs_per_100g === 0
                    ? `${carbs_per_100g}g`
                    : '-'}
                </strong>
              </Td>
            </Tr>
            <Tr>
              <Td>Sugar</Td>
              <Td isNumeric>{sugar || sugar === 0 ? `${sugar}g` : '-'}</Td>
            </Tr>
            <Tr>
              <Td>Sodium</Td>
              <Td isNumeric>{sodium || sodium === 0 ? `${sodium}mg` : '-'}</Td>
            </Tr>
            <Tr>
              <Td>Energy</Td>
              <Td isNumeric>{energy || energy === 0 ? `${energy}kJ` : '-'}</Td>
            </Tr>
            <Tr>
              <Td>Protein</Td>
              <Td isNumeric>
                {protein || protein === 0 ? `${protein}g` : '-'}
              </Td>
            </Tr>
            <Tr>
              <Td>Fat</Td>
              <Td isNumeric>{fat || fat === 0 ? `${fat}g` : '-'}</Td>
            </Tr>
            <Tr>
              <Td>Saturated Fat</Td>
              <Td isNumeric>
                {saturated_fat || saturated_fat === 0
                  ? `${saturated_fat}g`
                  : '-'}
              </Td>
            </Tr>
            <Tr>
              <Td>Fibre</Td>
              <Td isNumeric>{fibre || fibre === 0 ? `${fibre}g` : '-'}</Td>
            </Tr>
            <Tr>
              <Td>Alcohol</Td>
              <Td isNumeric>
                {alcohol || alcohol === 0 ? `${alcohol}g` : '-'}
              </Td>
            </Tr>
            <Tr>
              <Td>Caffeine</Td>
              <Td isNumeric>
                {caffeine || caffeine === 0 ? `${caffeine}g` : '-'}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  )
}
