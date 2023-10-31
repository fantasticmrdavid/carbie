// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/app/lib/prisma'
import { Prisma } from '@prisma/client'

const mealWithRelations = Prisma.validator<Prisma.MealDefaultArgs>()({
  include: {
    ingredients: true,
  },
})

export type MealWithRelations = Prisma.MealGetPayload<typeof mealWithRelations>
export const getMeals = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      query: { q },
    } = req

    const results = await prisma.meal.findMany({
      select: {
        id: true,
        name: true,
        ingredients: true,
      },
      where: {
        OR: [
          {
            name: {
              search: (q as string).split(' ').join(' & '),
            },
          },
          {
            name: {
              contains: q as string,
              mode: 'insensitive',
            },
          },
        ],
      },
    })

    const toSorted = results.toSorted((r1, r2) => {
      return r1.name.length > r2.name.length ? 1 : -1
    })

    return res.status(200).json(toSorted.slice(0, 5))
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}
