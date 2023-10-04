import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { NutritionTable } from '@/app/components/NutritionTable/NutritionTable'
import { Flex, Heading, Skeleton, useDisclosure } from '@chakra-ui/react'
import { CarbCalculator } from '@/app/components/CarbCalculator/CarbCalculator'
import { IngredientFormModal } from '@/app/components/IngredientFormModal/IngredientFormModal'
import { FaRegEdit } from 'react-icons/fa'
import type { IngredientWithRelations } from '@/pages/api/ingredients/[id]'
import { useSession } from 'next-auth/react'
import { NutritionTableLoadingSkeleton } from '@/app/components/NutritionTable/NutritionTableLoadingSkeleton'

export const Page = () => {
  const { data: session } = useSession()
  const { query } = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { id } = query
  const { data: ingredient, isLoading } = useQuery<IngredientWithRelations>(
    ['getIngredient', id],
    async () => await fetch(`/api/ingredients/${id}`).then((res) => res.json()),
  )

  if (isLoading) {
    return (
      <Flex direction={'column'} gap={'0.5em'} padding={'2em 0'}>
        <Heading size={'md'}>
          <Skeleton height="20px" width={'30%'} />
        </Heading>
        <Heading as="h3" noOfLines={2}>
          <Skeleton height="30px" width={'80%'} />
        </Heading>
        <Flex marginTop={'1em'} direction={'column'} gap={'1em'}>
          <NutritionTableLoadingSkeleton />
          <Skeleton mt={'1'} height="20px" width={'65%'} />
        </Flex>
      </Flex>
    )
  }

  const userOwnsIngredient =
    ingredient?.users?.some((u) => u.email === session?.user?.email) || false

  if (ingredient && !isLoading) {
    return (
      <Flex direction={'column'} padding={'2em 0'}>
        <Heading size={'md'}>{ingredient.brand_vendor}</Heading>
        <Heading
          as="h3"
          noOfLines={2}
          style={{ display: 'flex', alignItems: 'center', gap: '0.2em' }}
        >
          {ingredient.name}
          {userOwnsIngredient && (
            <>
              <FaRegEdit
                onClick={onOpen}
                style={{
                  cursor: 'pointer',
                }}
              />
              <IngredientFormModal
                mode={'edit'}
                ingredient={ingredient}
                isOpen={isOpen}
                onClose={onClose}
              />
            </>
          )}
        </Heading>
        <Flex marginTop={'1em'} direction={'column'} gap={'1em'}>
          <NutritionTable ingredient={ingredient} />
          <CarbCalculator ingredient={ingredient} />
        </Flex>
      </Flex>
    )
  }

  return <div>Ingredient not found</div>
}

export default Page
