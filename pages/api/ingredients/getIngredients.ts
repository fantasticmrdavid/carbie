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
      orderBy: [{ name: 'asc' }],
    })
    return res.status(200).json(results)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}
