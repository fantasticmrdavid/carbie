import React, { useState } from 'react'
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
  const { data = [] } = useQuery<Ingredient[]>(
    ['searchIngredients'],
    async () =>
      await axios.get(`/api/ingredients?q=${search}`).then((res) => res.data),
  )

  const items =
    search.length >= MIN_SEARCH_CHARS && data
      ? data.map((d) => ({
          id: d.id,
          name: `${d.name} - ${d.brand_vendor}`,
        }))
      : []

  return (
    <div className={styles.container}>
      <ReactSearchAutocomplete<Item>
        fuseOptions={{
          threshold: 0.3,
        }}
        inputDebounce={50}
        items={items}
        onSearch={(s) => {
          if (s.length >= MIN_SEARCH_CHARS) setSearch(s)
        }}
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
        showNoResults={search.length >= MIN_SEARCH_CHARS}
        onClear={() => {
          setSearch('')
        }}
      />
    </div>
  )
}
