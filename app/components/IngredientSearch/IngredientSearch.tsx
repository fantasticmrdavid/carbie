import React, { useState } from 'react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { useQuery } from '@tanstack/react-query'
import type { Ingredient } from '@prisma/client'

type Item = {
  id: string
  name: string
}
export const IngredientSearch = () => {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useQuery<Ingredient[]>(
    ['getIngredients'],
    async () =>
      await fetch(`/api/ingredients?q=${search}`).then((res) => res.json()),
  )

  const items =
    !isLoading && data
      ? data.map((d) => ({
          id: d.id,
          name: d.name,
        }))
      : []

  return (
    <div style={{ width: 400 }}>
      <ReactSearchAutocomplete<Item>
        items={items}
        onSearch={(s) => setSearch(s)}
        onSelect={() => console.log(search)}
        formatResult={(item: Item) => item.name}
        placeholder={'Search ingredients'}
        autoFocus
      />
    </div>
  )
}
