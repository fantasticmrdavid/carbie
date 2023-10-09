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
  isInvalid: boolean
}
export const VendorAutocomplete = (props: Props) => {
  const { onSelect, value, isInvalid } = props
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

  const styling = {
    ...{
      borderRadius: '0.375rem',
      height: '37px',
      zIndex: 2,
    },
    ...(isInvalid ? { border: '2px solid #E53E3E' } : {}),
  }

  return (
    <div className={styles.container}>
      <ReactSearchAutocomplete<Item>
        fuseOptions={{
          threshold: 0.3,
        }}
        items={items}
        inputSearchString={value}
        onSearch={(s) => {
          if (s.length > 0) {
            onSelect(s)
            setSearch(s)
          }
          return false
        }}
        onSelect={(i) => {
          onSelect(i.name)
        }}
        formatResult={(item: Item) => (
          <div style={{ cursor: 'pointer' }}>{item.name}</div>
        )}
        placeholder={'eg. Bakers Delight'}
        styling={styling}
        showNoResults={false}
        showIcon={false}
        autoFocus={false}
        onClear={() => onSelect('')}
      />
    </div>
  )
}
