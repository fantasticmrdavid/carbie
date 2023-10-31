import React, { useState } from 'react'
import { Ingredient } from '@prisma/client'
import {
  Button,
  FormControl,
  Grid,
  GridItem,
  Input,
  InputGroup,
  Select,
  useMediaQuery,
} from '@chakra-ui/react'
import { IngredientSearch } from '@/app/components/IngredientSearch/IngredientSearch'
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon'

type QtyMode = 'grams' | 'units'

export type MealIngredientProps = {
  ingredient: Ingredient
  qtyMode: QtyMode
  qty: string
}

type Props = {
  id: string
  value?: MealIngredientProps
  mode: 'add' | 'edit'
  onChange: (payload: MealIngredientProps) => void
  onRemove?: (ingredient: Ingredient) => void
}

export const MealIngredient = (props: Props) => {
  const { id, value, onChange, onRemove, mode } = props
  const [ingredient, setIngredient] = useState<Ingredient | null>(
    value?.ingredient ?? null,
  )
  const [qtyMode, setQtyMode] = useState<QtyMode>(value?.qtyMode ?? 'grams')
  const [qty, setQty] = useState<string>(value?.qty ?? '')
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)')
  const isValid = ingredient && qtyMode && parseFloat(qty) > 0

  const resetForm = () => {
    setIngredient(null)
    setQty('')
    setQtyMode('grams')
  }

  return (
    <Grid
      templateColumns={'1fr auto'}
      alignItems={'center'}
      gap={'0.5em'}
      mb={isLargerThan800 ? 0 : 4}
    >
      <GridItem>
        <Grid
          display={isLargerThan800 ? 'grid' : 'flex'}
          flexWrap={isLargerThan800 ? 'nowrap' : 'wrap'}
          templateColumns={'1fr 65px 100px auto'}
          alignItems={'flex-start'}
          gap={'0.5em'}
        >
          <GridItem minWidth={isLargerThan800 ? 'auto' : '100%'}>
            <IngredientSearch
              id={id}
              variant={'formInput'}
              hideSearchIcon
              value={ingredient?.name ?? ''}
              placeholder={'Search'}
              onChange={(i) => {
                setIngredient(i)

                if (mode === 'edit')
                  onChange({
                    ingredient: i,
                    qtyMode,
                    qty,
                  })
              }}
              allowClear={mode === 'add'}
            />
          </GridItem>
          <GridItem width={isLargerThan800 ? 'auto' : '65px'}>
            <FormControl>
              <InputGroup>
                <Input
                  type={'number'}
                  value={qty}
                  onChange={(e) => {
                    const newQty = e.target.value
                    setQty(newQty)
                    if (mode === 'edit')
                      onChange({
                        ingredient: ingredient as Ingredient,
                        qtyMode,
                        qty: newQty,
                      })
                  }}
                  placeholder={'qty'}
                />
              </InputGroup>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <InputGroup>
                <Select
                  defaultValue={qtyMode ?? 'grams'}
                  value={qtyMode}
                  onChange={(e) => {
                    const newQtyMode = e.target.value as QtyMode
                    setQtyMode(newQtyMode)

                    if (mode === 'edit') {
                      onChange({
                        ingredient: ingredient as Ingredient,
                        qtyMode: newQtyMode,
                        qty,
                      })
                    }
                  }}
                >
                  <option value={'grams'}>grams</option>
                  <option value={'units'}>units</option>
                </Select>
              </InputGroup>
            </FormControl>
          </GridItem>
          <GridItem py={2}>
            {ingredient && parseFloat(qty) > 0 && qtyMode === 'grams' && (
              <span>
                {((ingredient.carbs_per_100g * parseFloat(qty)) / 100).toFixed(
                  1,
                )}
                g/c
              </span>
            )}
            {ingredient &&
              ingredient.carbs_per_serve &&
              parseFloat(qty) > 0 &&
              qtyMode === 'units' && (
                <span>
                  {(ingredient.carbs_per_serve * parseFloat(qty)).toFixed(1)}g/c
                </span>
              )}
          </GridItem>
        </Grid>
      </GridItem>
      {mode === 'add' && (
        <GridItem>
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
      {mode === 'edit' && ingredient && onRemove && (
        <Button onClick={() => onRemove(ingredient)}>
          <CloseIcon />
        </Button>
      )}
    </Grid>
  )
}
