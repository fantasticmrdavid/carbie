import React, { useEffect, useState } from 'react'
import {
  Box,
  Input,
  List,
  ListItem,
  Spinner,
  Text,
  VStack,
  Divider,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Ingredient } from '@prisma/client'
import styles from './ingredientSearch.module.scss'
import axios from 'axios'
import { FiSearch } from 'react-icons/fi'
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon'

const MIN_SEARCH_CHARS = 3

type Props = {
  id: string
  onChange: (i: Ingredient) => void
  variant?: 'default' | 'formInput'
  hideSearchIcon?: boolean
  placeholder?: string
  allowClear?: boolean
  value?: string
}

export const IngredientSearch = (props: Props) => {
  const {
    id,
    onChange,
    variant = 'default',
    allowClear = true,
    hideSearchIcon = false,
    placeholder,
    value,
  } = props
  const queryClient = useQueryClient()
  const [search, setSearch] = useState(value ?? '')
  const [isResultsOpen, setIsResultsOpen] = useState(false)
  const { data, isLoading, refetch } = useQuery<Ingredient[]>({
    queryKey: ['searchIngredients', id, search],
    queryFn: async ({ signal }) =>
      await axios
        .get(`/api/ingredients?q=${search}`, { signal })
        .then((res) => res.data),
    enabled: false,
  })

  useEffect(() => {
    setSearch(value ?? '')
  }, [value])

  useEffect(() => {
    if (search.length >= MIN_SEARCH_CHARS) refetch()
  }, [search, refetch])

  useEffect(() => {
    // Clean up the query when the component unmounts
    return () => {
      queryClient.cancelQueries({ queryKey: ['searchIngredients', id, search] })
    }
  }, [id, queryClient, search])

  return (
    <div
      className={
        variant === 'default' ? styles.container : styles.containerFormField
      }
    >
      <Box
        className={
          variant === 'default'
            ? styles.searchField
            : styles.searchFieldFormField
        }
      >
        <InputGroup alignItems={'center'}>
          {!hideSearchIcon && (
            <InputLeftElement pointerEvents="none" top={'unset'}>
              <FiSearch opacity={0.5} />
            </InputLeftElement>
          )}
          <Input
            outline={'unset'}
            placeholder={placeholder ?? 'Search for food and drinks...'}
            value={search}
            onChange={(e) => {
              setIsResultsOpen(true)
              setSearch(e.target.value)
            }}
            onFocus={() => setIsResultsOpen(true)}
            size="lg"
            borderWidth={'0px'}
            borderRadius={'24px'}
            className={styles.searchInput}
          />
          {isLoading && search.length >= MIN_SEARCH_CHARS && (
            <InputRightElement pointerEvents="none" top={'unset'}>
              <Spinner size="sm" />
            </InputRightElement>
          )}
          {!isLoading && search.length > 0 && allowClear && (
            <InputRightElement
              cursor={'pointer'}
              top={'unset'}
              opacity={0.5}
              right={'0.5em'}
            >
              <div onClick={() => setSearch('')}>
                <CloseIcon />
              </div>
            </InputRightElement>
          )}
        </InputGroup>
        {!isLoading && isResultsOpen && search.length >= MIN_SEARCH_CHARS && (
          <>
            <Divider marginLeft={'1em'} width={'calc(100% - 2em)'} />
            <VStack
              position={'relative'}
              align={'flex-start'}
              spacing={0}
              backgroundColor={'#fff'}
              zIndex={2}
              borderRadius={'24px'}
              padding={'0.5em'}
            >
              {data?.map((i) => (
                <List
                  key={i.id}
                  onClick={() => {
                    setIsResultsOpen(false)
                    setSearch(i.name)
                    onChange(i)
                  }}
                  cursor={'pointer'}
                  p={2}
                  _hover={{
                    bgColor: 'gray.100',
                  }}
                  w={'100%'}
                  textAlign={'left'}
                >
                  <ListItem display={'flex'} alignItems={'center'}>
                    <Text>
                      {i.name} - {i.brand_vendor}
                    </Text>
                  </ListItem>
                </List>
              ))}
              {((!isLoading && !data) || (data && data.length === 0)) && (
                <List
                  key={'noResults'}
                  p={2}
                  _hover={{
                    bgColor: 'gray.100',
                  }}
                  w={'100%'}
                  textAlign={'left'}
                >
                  <ListItem display={'flex'} alignItems={'center'}>
                    <Text>No results</Text>
                  </ListItem>
                </List>
              )}
            </VStack>
          </>
        )}
      </Box>
    </div>
  )
}
