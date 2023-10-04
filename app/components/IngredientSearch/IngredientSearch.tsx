import React, { useState } from 'react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import type { Ingredient } from '@prisma/client'
import styles from './ingredientSearch.module.scss'

type Item = {
  id: string
  name: string
}
export const IngredientSearch = () => {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const { data, isLoading } = useQuery<Ingredient[]>(
    ['searchIngredients'],
    async () =>
      await fetch(`/api/ingredients?q=${search}`).then((res) => res.json()),
  )

  const items =
    !isLoading && data
      ? data.map((d) => ({
          id: d.id,
          name: `${d.name} (${d.brand_vendor})`,
        }))
      : []

  return (
    <div className={styles.container}>
      <ReactSearchAutocomplete<Item>
        items={items}
        onSearch={(s) => (s.length > 0 ? setSearch(s) : false)}
        onSelect={(i) => {
          router.push(`/ingredient/${i.id}`)
        }}
        formatResult={(item: Item) => item.name}
        placeholder={'Search ingredients'}
        styling={{
          zIndex: 2,
        }}
        autoFocus
      />
    </div>
  )
}
