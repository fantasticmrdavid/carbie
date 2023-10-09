import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { NutritionTable } from '@/app/components/NutritionTable/NutritionTable'
import {
  Flex,
  Heading,
  Skeleton,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import { CarbCalculator } from '@/app/components/CarbCalculator/CarbCalculator'
import { WeightCalculator } from '@/app/components/WeightCalculator/WeightCalculator'
import { IngredientFormModal } from '@/app/components/IngredientFormModal/IngredientFormModal'
import { FaRegEdit } from 'react-icons/fa'
import type { IngredientWithRelations } from '@/pages/api/ingredients/[id]'
import { useSession } from 'next-auth/react'
import { NutritionTableLoadingSkeleton } from '@/app/components/NutritionTable/NutritionTableLoadingSkeleton'
import Head from 'next/head'

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
          <Skeleton mt={'1'} height="20px" width={'70%'} />
        </Flex>
      </Flex>
    )
  }

  const head = (
    <Head>
      <title>
        ~Carbie - {ingredient?.name} - {ingredient?.brand_vendor}~
      </title>
    </Head>
  )

  const userOwnsIngredient =
    ingredient?.users?.some((u) => u.email === session?.user?.email) || false

  if (ingredient && !isLoading) {
    return (
      <>
        {head}
        <Flex direction={'column'} pb={6}>
          <Heading size={'md'}>{ingredient.brand_vendor}</Heading>
          <Heading
            as="h3"
            noOfLines={2}
            style={{ display: 'flex', alignItems: 'center', gap: '0.2em' }}
          >
            {ingredient.name}
            {userOwnsIngredient && (
              <>
                <Tooltip
                  label={'Edit Ingredient'}
                  placement={'right-start'}
                  hasArrow
                >
                  <div style={{ position: 'relative' }}>
                    <FaRegEdit
                      onClick={onOpen}
                      style={{
                        cursor: 'pointer',
                      }}
                    />
                  </div>
                </Tooltip>
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
            {ingredient.data_source !== 'web' && (
              <div>
                <strong>Data source:</strong> {ingredient.data_source}
              </div>
            )}
            {ingredient.notes && ingredient.notes.length > 0 && (
              <div>
                <strong>Notes:</strong> {ingredient.notes}
              </div>
            )}
            <NutritionTable ingredient={ingredient} />
            {ingredient.carbs_per_100g > 0 && (
              <>
                <CarbCalculator ingredient={ingredient} />
                <WeightCalculator ingredient={ingredient} />
              </>
            )}
          </Flex>
        </Flex>
      </>
    )
  }

  return <div>Ingredient not found</div>
}

export default Page
