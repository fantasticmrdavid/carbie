import React from 'react'
import {
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
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
    carbs_per_serve,
    energy_per_serve,
    protein_per_serve,
    fat_per_serve,
    saturated_fat_per_serve,
    sugar_per_serve,
    sodium_per_serve,
    fibre_per_serve,
    alcohol_per_serve,
    caffeine_per_serve,
  } = ingredient

  const has100gData =
    energy_per_100g ||
    protein_per_100g ||
    fat_per_100g ||
    saturated_fat_per_100g ||
    carbs_per_100g ||
    sugar_per_100g ||
    fibre_per_100g ||
    sodium_per_100g ||
    alcohol_per_100g ||
    caffeine_per_100g

  const hasServingData =
    energy_per_serve ||
    protein_per_serve ||
    fat_per_serve ||
    saturated_fat_per_serve ||
    carbs_per_serve ||
    sugar_per_serve ||
    fibre_per_serve ||
    sodium_per_serve ||
    alcohol_per_serve ||
    caffeine_per_serve

  const per100gTable = (
    <TableContainer>
      <Table size="sm">
        <Tbody>
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
            <Td>Fibre</Td>
            <Td isNumeric>
              {fibre_per_100g || fibre_per_100g === 0
                ? `${fibre_per_100g}g`
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
  )

  const perServingTable = (
    <TableContainer>
      <Table size="sm">
        <Tbody>
          <Tr>
            <Td>
              <strong>Carbs</strong>
            </Td>
            <Td isNumeric>
              <strong>
                {carbs_per_serve || carbs_per_serve === 0
                  ? `${carbs_per_serve}g`
                  : '-'}
              </strong>
            </Td>
          </Tr>
          <Tr>
            <Td>Sugar</Td>
            <Td isNumeric>
              {sugar_per_serve || sugar_per_serve === 0
                ? `${sugar_per_serve}g`
                : '-'}
            </Td>
          </Tr>
          <Tr>
            <Td>Sodium</Td>
            <Td isNumeric>
              {sodium_per_serve || sodium_per_serve === 0
                ? `${sodium_per_serve}mg`
                : '-'}
            </Td>
          </Tr>
          <Tr>
            <Td>Energy</Td>
            <Td isNumeric>
              {energy_per_serve || energy_per_serve === 0
                ? `${energy_per_serve}kJ`
                : '-'}
            </Td>
          </Tr>
          <Tr>
            <Td>Protein</Td>
            <Td isNumeric>
              {protein_per_serve || protein_per_serve === 0
                ? `${protein_per_serve}g`
                : '-'}
            </Td>
          </Tr>
          <Tr>
            <Td>Fat</Td>
            <Td isNumeric>
              {fat_per_serve || fat_per_serve === 0 ? `${fat_per_serve}g` : '-'}
            </Td>
          </Tr>
          <Tr>
            <Td>Saturated Fat</Td>
            <Td isNumeric>
              {saturated_fat_per_serve || saturated_fat_per_serve === 0
                ? `${saturated_fat_per_serve}g`
                : '-'}
            </Td>
          </Tr>
          <Tr>
            <Td>Fibre</Td>
            <Td isNumeric>
              {fibre_per_serve || fibre_per_serve === 0
                ? `${fibre_per_serve}g`
                : '-'}
            </Td>
          </Tr>
          <Tr>
            <Td>Alcohol</Td>
            <Td isNumeric>
              {alcohol_per_serve || alcohol_per_serve === 0
                ? `${alcohol_per_serve}g`
                : '-'}
            </Td>
          </Tr>
          <Tr>
            <Td>Caffeine</Td>
            <Td isNumeric>
              {caffeine_per_serve || caffeine_per_serve === 0
                ? `${caffeine_per_serve}g`
                : '-'}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  )

  if (has100gData && hasServingData)
    return (
      <Tabs>
        <TabList>
          <Tab>
            <strong>Per 100g</strong>
          </Tab>
          <Tab>
            <strong>Per Serving</strong>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>{per100gTable}</TabPanel>
          <TabPanel>{perServingTable}</TabPanel>
        </TabPanels>
      </Tabs>
    )

  if (hasServingData)
    return (
      <div>
        <Heading as="h5" noOfLines={1} size={'md'}>
          Nutrition information (per serving)
        </Heading>
        {perServingTable}
      </div>
    )

  if (has100gData)
    return (
      <div>
        <Heading as="h5" noOfLines={1} size={'md'}>
          Nutrition information (per 100g)
        </Heading>
        {per100gTable}
      </div>
    )
}
