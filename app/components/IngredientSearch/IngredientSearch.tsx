import React, { useState } from 'react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import type { Ingredient } from '@prisma/client'

type Item = {
  id: string
  name: string
}
export const IngredientSearch = () => {
  const router = useRouter()
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
          name: `${d.name} (${d.brand_vendor})`,
        }))
      : []

  return (
    <div style={{ width: 400 }}>
      <ReactSearchAutocomplete<Item>
        items={items}
        onSearch={(s) => setSearch(s)}
        onSelect={(i) => router.push(`/ingredient/${i.id}`)}
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
