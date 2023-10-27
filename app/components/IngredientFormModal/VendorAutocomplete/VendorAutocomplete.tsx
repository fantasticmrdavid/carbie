import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import styles from './vendorAutocomplete.module.scss'
import axios from 'axios'
import {
  Box,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  List,
  ListItem,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FiSearch } from 'react-icons/fi'
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon'

type Props = {
  onSelect: (s: string) => void
  value?: string
}

const MIN_SEARCH_CHARS = 2
export const VendorAutocomplete = (props: Props) => {
  const { onSelect, value } = props
  const queryClient = useQueryClient()
  const [search, setSearch] = useState(value)
  const [isResultsOpen, setIsResultsOpen] = useState(false)
  const { data, isLoading, refetch } = useQuery<string[]>({
    queryKey: ['searchVendors'],
    queryFn: async () =>
      await axios.get(`/api/vendors?q=${search}`).then((res) => res.data),
    enabled: false,
  })

  useEffect(() => {
    refetch()
  }, [search, refetch])

  useEffect(() => {
    // Clean up the query when the component unmounts
    return () => {
      queryClient.cancelQueries({ queryKey: ['searchVendors'] })
    }
  }, [queryClient])

  return (
    <div className={styles.container}>
      <Box className={styles.searchField}>
        <InputGroup alignItems={'center'}>
          <InputLeftElement pointerEvents="none" top={'unset'}>
            <FiSearch opacity={0.5} />
          </InputLeftElement>
          <Input
            outline={'unset'}
            placeholder="Search for brands/vendors"
            value={search}
            onChange={(e) => {
              setIsResultsOpen(true)
              setSearch(e.target.value)
              onSelect(e.target.value)
            }}
            onFocus={() => setIsResultsOpen(true)}
            size="lg"
            borderWidth={'0px'}
            borderRadius={'24px'}
            className={styles.searchInput}
          />
          {isLoading && search && search.length >= MIN_SEARCH_CHARS && (
            <InputRightElement pointerEvents="none" top={'unset'}>
              <Spinner size="sm" />
            </InputRightElement>
          )}
          {!isLoading && search && search.length > 0 && (
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
        {!isLoading &&
          isResultsOpen &&
          search &&
          search.length >= MIN_SEARCH_CHARS && (
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
                {data &&
                  data.map((s) => (
                    <List
                      key={`vendorSearch_${s}`}
                      onClick={() => {
                        if (s.length > 0) {
                          onSelect(s)
                          setSearch(s)
                        }
                        return false
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
                        <Text>{s}</Text>
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
