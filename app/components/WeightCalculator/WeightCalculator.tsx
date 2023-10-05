import React, { useState } from 'react'
import { Flex, Input } from '@chakra-ui/react'
import { Ingredient } from '@prisma/client'
import styles from './weightCalculator.module.scss'

type Props = {
  ingredient: Ingredient
}

export const WeightCalculator = ({ ingredient }: Props) => {
  const [weightCalcValue, setWeightCalcValue] = useState<number | undefined>()
  return (
    <Flex className={styles.weightCalculator}>
      <Flex alignItems={'center'} gap={'0.2em'}>
        How many carbs are in{' '}
        <Input
          textAlign={'right'}
          width={'70px'}
          type={'number'}
          onChange={(e) =>
            setWeightCalcValue(
              e.target.value ? parseFloat(e.target.value) : undefined,
            )
          }
        />
        g of this ingredient?
      </Flex>
      {weightCalcValue && weightCalcValue > 0 && (
        <Flex alignItems={'center'}>
          <strong>
            {((ingredient.carbs_per_100g / 100) * weightCalcValue).toFixed(2)}g
          </strong>
        </Flex>
      )}
    </Flex>
  )
}
