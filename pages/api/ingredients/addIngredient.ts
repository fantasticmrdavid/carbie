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
      sugar,
      fibre,
      alcohol,
      caffeine,
    } = req.body

    const result = await prisma.ingredient.create({
      data: {
        name,
        brand_vendor: brand,
        carbs_per_100g: parseFloat(carbsPer100g),
        energy: energy ? parseFloat(energy) : undefined,
        protein: protein ? parseFloat(protein) : undefined,
        fat: fat ? parseFloat(fat) : undefined,
        sugar: sugar ? parseFloat(sugar) : undefined,
        sodium: sodium ? parseFloat(sodium) : undefined,
        fibre: fibre ? parseFloat(fibre) : undefined,
        alcohol: alcohol ? parseFloat(alcohol) : undefined,
        caffeine: caffeine ? parseFloat(caffeine) : undefined,
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
