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
      energy,
      sodium,
      protein,
      fat,
      saturatedFat,
      sugar,
      fibre,
      alcohol,
      caffeine,
    } = req.body

    const result = await prisma.ingredient.create({
      data: {
        name: name.trim(),
        brand_vendor: brand.trim(),
        carbs_per_100g: parseFloat(carbsPer100g),
        energy_per_100g: energy ? parseFloat(energy) : undefined,
        protein_per_100g: protein ? parseFloat(protein) : undefined,
        fat_per_100g: fat ? parseFloat(fat) : undefined,
        saturated_fat_per_100g: saturatedFat
          ? parseFloat(saturatedFat)
          : undefined,
        sugar_per_100g: sugar ? parseFloat(sugar) : undefined,
        sodium_per_100g: sodium ? parseFloat(sodium) : undefined,
        fibre_per_100g: fibre ? parseFloat(fibre) : undefined,
        alcohol_per_100g: alcohol ? parseFloat(alcohol) : undefined,
        caffeine_per_100g: caffeine ? parseFloat(caffeine) : undefined,
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
