import React, { useState } from 'react'
import { Ingredient } from '@prisma/client'
import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputGroup,
  Select,
  Tooltip,
  useMediaQuery,
} from '@chakra-ui/react'
import { IngredientSearch } from '@/app/components/IngredientSearch/IngredientSearch'
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon'
import { useOutsideClick } from 'outsideclick-react'

type QtyMode = 'grams' | 'units'

export type MealIngredientProps = {
  ingredient: Ingredient
  qtyMode: QtyMode
  qty: string
}

type Props = {
  id: string
  value?: MealIngredientProps
  mode: 'add' | 'modify'
  onChange: (payload: MealIngredientProps) => void
  onRemove?: (ingredient: Ingredient) => void
}

export const MealIngredient = (props: Props) => {
  const { id, value, onChange, onRemove, mode } = props
  const [isEditing, setIsEditing] = useState(mode === 'add')
  const [ingredient, setIngredient] = useState<Ingredient | null>(
    value?.ingredient ?? null,
  )
  const [qtyMode, setQtyMode] = useState<QtyMode>(value?.qtyMode ?? 'grams')
  const [qty, setQty] = useState<string>(value?.qty ?? '')
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)')
  const isValid = ingredient && qtyMode && parseFloat(qty) > 0

  const hasServingInfo =
    ingredient?.carbs_per_serve && ingredient?.serving_size_units

  const handleOutsideClick = () => {
    if (mode === 'modify') setIsEditing(false)
  }

  const ref = useOutsideClick(handleOutsideClick)

  const resetForm = () => {
    setIngredient(null)
    setQty('')
    setQtyMode('grams')
  }

  if (mode !== 'add' && !isEditing)
    return (
      <Tooltip label={'Click to edit'} placement={'top-end'} hasArrow>
        <Grid
          templateColumns={'1fr auto'}
          alignItems={'center'}
          gap={'0.5em'}
          mb={isLargerThan800 ? 0 : 4}
          onClick={() => setIsEditing(true)}
        >
          <GridItem pl={4}>
            {ingredient?.name} ({ingredient?.brand_vendor}) x {qty} {qtyMode}
          </GridItem>
          <GridItem>
            {ingredient &&
              ingredient.carbs_per_100g &&
              parseFloat(qty) > 0 &&
              qtyMode === 'grams' && (
                <strong>
                  {(
                    (ingredient.carbs_per_100g * parseFloat(qty)) /
                    100
                  ).toFixed(1)}
                  g/c
                </strong>
              )}
            {ingredient &&
              ingredient.carbs_per_serve &&
              ingredient.serving_size_units &&
              parseFloat(qty) > 0 &&
              qtyMode === 'units' && (
                <strong>
                  {(
                    (ingredient.carbs_per_serve /
                      ingredient.serving_size_units) *
                    parseFloat(qty)
                  ).toFixed(1)}
                  g/c
                </strong>
              )}
          </GridItem>
        </Grid>
      </Tooltip>
    )

  return (
    <Grid
      templateColumns={'1fr auto'}
      alignItems={'center'}
      gap={'0.5em'}
      mb={isLargerThan800 ? 0 : 4}
      ref={ref}
    >
      <GridItem>
        <Grid
          display={isLargerThan800 ? 'grid' : 'flex'}
          flexWrap={isLargerThan800 ? 'nowrap' : 'wrap'}
          templateColumns={'1fr 0.3fr 100px auto'}
          alignItems={'flex-start'}
          gap={'0.5em'}
        >
          <GridItem minWidth={isLargerThan800 ? 'auto' : '100%'}>
            <FormControl>
              <FormLabel>Item Name</FormLabel>
              <IngredientSearch
                id={id}
                variant={'formInput'}
                hideSearchIcon
                value={ingredient?.name ?? ''}
                placeholder={'Search'}
                onChange={(i) => {
                  setIngredient(i)

                  if (mode === 'modify')
                    onChange({
                      ingredient: i,
                      qtyMode,
                      qty,
                    })
                }}
                allowClear={mode === 'add'}
              />
            </FormControl>
          </GridItem>
          <GridItem width={'auto'}>
            <FormControl>
              <FormLabel>{qtyMode === 'grams' ? 'Weight' : 'Qty'}</FormLabel>
              <InputGroup>
                <Input
                  type={'number'}
                  value={qty}
                  onChange={(e) => {
                    const newQty = e.target.value
                    setQty(newQty)
                    if (mode === 'modify')
                      onChange({
                        ingredient: ingredient as Ingredient,
                        qtyMode,
                        qty: newQty,
                      })
                  }}
                  placeholder={qtyMode === 'grams' ? 'eg. 100' : 'eg. 1'}
                />
              </InputGroup>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Metric</FormLabel>
              <InputGroup>
                <Select
                  defaultValue={qtyMode ?? 'grams'}
                  value={qtyMode}
                  onChange={(e) => {
                    const newQtyMode = e.target.value as QtyMode
                    setQtyMode(newQtyMode)

                    if (mode === 'modify') {
                      onChange({
                        ingredient: ingredient as Ingredient,
                        qtyMode: newQtyMode,
                        qty,
                      })
                    }
                  }}
                >
                  <option value={'grams'}>grams</option>
                  {hasServingInfo && <option value={'units'}>units</option>}
                </Select>
              </InputGroup>
            </FormControl>
          </GridItem>
          <GridItem pb={2} pt={10}>
            {ingredient &&
              ingredient.carbs_per_100g &&
              parseFloat(qty) > 0 &&
              qtyMode === 'grams' && (
                <strong>
                  {(
                    (ingredient.carbs_per_100g * parseFloat(qty)) /
                    100
                  ).toFixed(1)}
                  g/c
                </strong>
              )}
            {ingredient &&
              ingredient.carbs_per_serve &&
              ingredient.serving_size_units &&
              parseFloat(qty) > 0 &&
              qtyMode === 'units' && (
                <strong>
                  {(
                    (ingredient.carbs_per_serve /
                      ingredient.serving_size_units) *
                    parseFloat(qty)
                  ).toFixed(1)}
                  g/c
                </strong>
              )}
          </GridItem>
        </Grid>
      </GridItem>
      {mode === 'add' && (
        <GridItem pt={8}>
          <Button
            disabled={!isValid}
            onClick={() => {
              if (isValid) {
                onChange({
                  ingredient,
                  qtyMode,
                  qty,
                })
                resetForm()
              }
            }}
          >
            Add
          </Button>
        </GridItem>
      )}
      {mode === 'modify' && ingredient && onRemove && (
        <GridItem pt={8}>
          <Button
            size={isLargerThan800 ? 'md' : 'sm'}
            onClick={() => onRemove(ingredient)}
          >
            <CloseIcon />
          </Button>
        </GridItem>
      )}
    </Grid>
  )
}
