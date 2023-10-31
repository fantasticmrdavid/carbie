import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/app/lib/prisma'
import { getToken } from 'next-auth/jwt'

export const addMeal = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = await getToken({ req })
    if (!token) return res.status(401)
    const { sub } = token
    if (!sub) return res.status(401)

    const {
      id,
      name,
      total_carbs,
      total_weight,
      carbs_per_100g,
      carbs_per_serve,
      ingredients,
      notes,
    } = req.body

    const result = await prisma.meal.update({
      data: {
        name: name.trim(),
        total_carbs,
        total_weight,
        carbs_per_100g,
        carbs_per_serve,
        notes: notes.trim(),
        ingredients: {
          connect: ingredients.map((ingredientId: string[]) => ({
            ingredientId,
          })),
        },
      },
      where: {
        id,
      },
    })

    return res.status(200).json(result)
  } catch (error) {
    console.log('SQL ERROR: ', error)
    return res.status(500).json({ error })
  }
}
