import React, { useState } from 'react'
import { Flex, Input } from '@chakra-ui/react'
import { Ingredient } from '@prisma/client'

type Props = {
  ingredient: Ingredient
}

export const CarbCalculator = ({ ingredient }: Props) => {
  const [carbCalcValue, setCarbCalcValue] = useState<number | undefined>()
  return (
    <Flex whiteSpace={'nowrap'} alignItems={'center'} gap={'0.2em'}>
      How much should I eat for{' '}
      <Input
        textAlign={'right'}
        width={'70px'}
        type={'number'}
        onChange={(e) =>
          setCarbCalcValue(
            e.target.value ? parseFloat(e.target.value) : undefined,
          )
        }
      />
      g of carbs?
      {carbCalcValue && carbCalcValue > 0 && (
        <strong>
          {((100 / ingredient.carbs_per_100g) * carbCalcValue).toFixed(2)}g
        </strong>
      )}
    </Flex>
  )
}
