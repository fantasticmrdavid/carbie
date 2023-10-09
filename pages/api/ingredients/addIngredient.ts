import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/app/lib/prisma'
import { getToken } from 'next-auth/jwt'

export const addIngredient = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  try {
    const token = await getToken({ req })
    if (!token) return res.status(401)
    const { sub } = token
    if (!sub) return res.status(401)

    const {
      name,
      brand,
      carbsPer100g,
      energyPer100g,
      sodiumPer100g,
      proteinPer100g,
      fatPer100g,
      saturatedFatPer100g,
      sugarPer100g,
      fibrePer100g,
      alcoholPer100g,
      caffeinePer100g,
      carbsPerServe,
      energyPerServe,
      sodiumPerServe,
      proteinPerServe,
      fatPerServe,
      saturatedFatPerServe,
      sugarPerServe,
      fibrePerServe,
      alcoholPerServe,
      caffeinePerServe,
    } = req.body

    const result = await prisma.ingredient.create({
      data: {
        name: name.trim(),
        brand_vendor: brand.trim(),
        carbs_per_100g: parseFloat(carbsPer100g),
        energy_per_100g: energyPer100g ? parseFloat(energyPer100g) : undefined,
        protein_per_100g: proteinPer100g
          ? parseFloat(proteinPer100g)
          : undefined,
        fat_per_100g: fatPer100g ? parseFloat(fatPer100g) : undefined,
        saturated_fat_per_100g: saturatedFatPer100g
          ? parseFloat(saturatedFatPer100g)
          : undefined,
        sugar_per_100g: sugarPer100g ? parseFloat(sugarPer100g) : undefined,
        sodium_per_100g: sodiumPer100g ? parseFloat(sodiumPer100g) : undefined,
        fibre_per_100g: fibrePer100g ? parseFloat(fibrePer100g) : undefined,
        alcohol_per_100g: alcoholPer100g
          ? parseFloat(alcoholPer100g)
          : undefined,
        caffeine_per_100g: caffeinePer100g
          ? parseFloat(caffeinePer100g)
          : undefined,
        carbs_per_serve: parseFloat(carbsPerServe),
        energy_per_serve: energyPer100g
          ? parseFloat(energyPerServe)
          : undefined,
        protein_per_serve: proteinPerServe
          ? parseFloat(proteinPerServe)
          : undefined,
        fat_per_serve: fatPerServe ? parseFloat(fatPerServe) : undefined,
        saturated_fat_per_serve: saturatedFatPerServe
          ? parseFloat(saturatedFatPerServe)
          : undefined,
        sugar_per_serve: sugarPerServe ? parseFloat(sugarPerServe) : undefined,
        sodium_per_serve: sodiumPerServe
          ? parseFloat(sodiumPerServe)
          : undefined,
        fibre_per_serve: fibrePerServe ? parseFloat(fibrePerServe) : undefined,
        alcohol_per_serve: alcoholPerServe
          ? parseFloat(alcoholPerServe)
          : undefined,
        caffeine_per_serve: caffeinePerServe
          ? parseFloat(caffeinePerServe)
          : undefined,
        data_source: 'web',
        users: {
          connect: {
            id: sub,
          },
        },
      },
    })

    return res.status(200).json(result)
  } catch (error) {
    console.log('SQL ERROR: ', error)
    return res.status(500).json({ error })
  }
}
