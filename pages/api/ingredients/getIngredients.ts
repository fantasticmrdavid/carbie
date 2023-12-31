// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/app/lib/prisma'

export const getIngredients = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  try {
    const {
      query: { q },
    } = req

    const results = await prisma.ingredient.findMany({
      select: {
        id: true,
        name: true,
        brand_vendor: true,
        is_generic: true,
        carbs_per_100g: true,
        carbs_per_serve: true,
        serving_size_units: true,
        serving_size_grams: true,
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
          {
            brand_vendor: {
              search: (q as string).split(' ').join(' & '),
            },
          },
          {
            brand_vendor: {
              contains: q as string,
              mode: 'insensitive',
            },
          },
        ],
      },
    })

    const sortedResults = results.sort((r1, r2) => {
      if (r1.is_generic && r2.is_generic)
        return r1.name.length > r2.name.length ? 1 : -1
      if (r1.is_generic) return -1
      if (r2.is_generic) return 1
      return r1.name.length > r2.name.length ? 1 : -1

      return 0
    })

    return res.status(200).json(sortedResults.slice(0, 5))
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}
