import React, { useEffect, useState } from 'react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import type { Ingredient } from '@prisma/client'
import styles from './ingredientSearch.module.scss'
import axios from 'axios'

type Item = {
  id: string
  name: string
}

const MIN_SEARCH_CHARS = 2

export const IngredientSearch = () => {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<Item[]>([])
  const { data, isLoading } = useQuery<Ingredient[]>(
    [`searchIngredients`, search],
    async () =>
      await axios.get(`/api/ingredients?q=${search}`).then((res) => res.data),
  )

  useEffect(() => {
    if (!isLoading && data) {
      setItems(
        data.map((d) => ({
          id: d.id,
          name: `${d.name} - ${d.brand_vendor}`,
        })),
      )
    }
  }, [search, data, isLoading, setItems])

  return (
    <div className={styles.container}>
      <ReactSearchAutocomplete<Item>
        fuseOptions={{
          threshold: 0.4,
        }}
        inputDebounce={100}
        items={items}
        onSearch={(s) => setSearch(s)}
        onSelect={(i) => {
          router.push(`/ingredient/${i.id}`)
        }}
        formatResult={(item: Item) => (
          <div style={{ cursor: 'pointer' }}>{item.name}</div>
        )}
        placeholder={'Search ingredients'}
        styling={{
          zIndex: 2,
        }}
        showNoResults={!isLoading && search.length > MIN_SEARCH_CHARS}
        onClear={() => setSearch('')}
      />
    </div>
  )
}
