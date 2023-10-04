import React, { useState } from 'react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { useQuery } from '@tanstack/react-query'
import styles from './vendorAutocomplete.module.scss'
import axios from 'axios'

type Item = {
  id: string
  name: string
}

type Props = {
  onSelect: (s: string) => void
  value?: string
}
export const VendorAutocomplete = (props: Props) => {
  const { onSelect, value } = props
  const [search, setSearch] = useState(value)
  const { data, isLoading } = useQuery<string[]>(
    ['searchVendors'],
    async () =>
      await axios.get(`/api/vendors?q=${search}`).then((res) => res.data),
  )

  const items =
    !isLoading && data
      ? data.map((d) => ({
          id: d,
          name: d,
        }))
      : []

  return (
    <div className={styles.container}>
      <ReactSearchAutocomplete<Item>
        fuseOptions={{
          threshold: 0.3,
        }}
        items={items}
        onSearch={(s) => (s.length > 0 ? setSearch(s) : false)}
        onSelect={(i) => {
          onSelect(i.name)
        }}
        formatResult={(item: Item) => (
          <div style={{ cursor: 'pointer' }}>{item.name}</div>
        )}
        placeholder={'eg. Bakers Delight'}
        styling={{
          borderRadius: '0.375rem',
          height: '40px',
          zIndex: 2,
        }}
        showNoResults={false}
      />
    </div>
  )
}
