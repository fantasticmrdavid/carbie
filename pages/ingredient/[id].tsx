import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { NutritionTable } from '@/app/components/NutritionTable/NutritionTable'
import { Flex, Heading, useDisclosure } from '@chakra-ui/react'
import { CarbCalculator } from '@/app/components/CarbCalculator/CarbCalculator'
import { IngredientFormModal } from '@/app/components/IngredientFormModal/IngredientFormModal'
import { FaRegEdit } from 'react-icons/fa'
import type { IngredientWithRelations } from '@/pages/api/ingredients/[id]'
import { useSession } from 'next-auth/react'

export const Page = () => {
  const { data: session } = useSession()
  const { query } = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { id } = query
  const { data: ingredient, isLoading } = useQuery<IngredientWithRelations>(
    ['getIngredient', id],
    async () => await fetch(`/api/ingredients/${id}`).then((res) => res.json()),
  )

  if (isLoading) return <div>Loading</div>

  const userOwnsIngredient =
    ingredient?.users?.some((u) => u.email === session?.user?.email) || false

  if (ingredient && !isLoading) {
    return (
      <Flex direction={'column'} padding={'2em 0'}>
        <Heading size={'md'}>{ingredient.brand_vendor}</Heading>
        <Heading as="h3" noOfLines={2}>
          {ingredient.name}
          {userOwnsIngredient && (
            <>
              <FaRegEdit
                onClick={onOpen}
                style={{
                  marginLeft: '0.2em',
                  cursor: 'pointer',
                  display: 'inline-block',
                  verticalAlign: 'sub',
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
