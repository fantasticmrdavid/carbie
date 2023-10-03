import React from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Ingredient } from '@prisma/client'
import { useRouter } from 'next/router'
import { NutritionTable } from '@/app/components/NutritionTable/NutritionTable'
import { Flex, Heading } from '@chakra-ui/react'
import { CarbCalculator } from '@/app/components/CarbCalculator/CarbCalculator'

export const Page = () => {
  const { query } = useRouter()
  const { id } = query
  const { data: ingredient, isLoading } = useQuery<Ingredient>(
    ['getIngredient'],
    async () => await fetch(`/api/ingredients/${id}`).then((res) => res.json()),
  )

  if (isLoading) return <div>Loading</div>

  if (ingredient && !isLoading) {
    return (
      <Flex gap={'1em'} direction={'column'} padding={'2em 0'}>
        <Heading as="h3" noOfLines={1}>
          {ingredient.name} ({ingredient.brand_vendor})
        </Heading>
        <NutritionTable ingredient={ingredient} />
        <CarbCalculator ingredient={ingredient} />
      </Flex>
    )
  }

  return <div>Ingredient not found</div>
}

export default Page
