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
      },
      take: 10,
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
              contains: q as string,
              mode: 'insensitive',
            },
          },
        ],
      },
    })

    return res.status(200).json(results.slice(0, 5))
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}
