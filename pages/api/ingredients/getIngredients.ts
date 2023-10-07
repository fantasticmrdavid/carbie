// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/app/lib/prisma'
import Fuse from 'fuse.js'

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
      },
      take: 10,
      where: {
        OR: [
          {
            name: {
              contains: q as string,
              mode: 'insensitive',
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

    const sortedResults = new Fuse(results, {
      threshold: 0.3,
      keys: ['name', 'brand_vendor'],
    })

    return res.status(200).json(
      sortedResults
        .search(q as string)
        .slice(0, 5)
        .map((i) => i.item),
    )
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}
