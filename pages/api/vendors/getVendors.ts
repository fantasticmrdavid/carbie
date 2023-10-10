// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/app/lib/prisma'

export const getVendors = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      query: { q },
    } = req

    const ingredients = await prisma.ingredient.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                brand_vendor: {
                  search: (q as string).split(' ').join(' & '),
                },
              },
              {
                brand_vendor: {
                  contains: q as string,
                },
              },
            ],
          },
          {
            users: {
              some: {
                email: {
                  in: [process.env.PUBLIC_ACCOUNT_EMAIL as string],
                },
              },
            },
          },
        ],
      },
      distinct: ['brand_vendor'],
      orderBy: [{ brand_vendor: 'asc' }],
    })

    const results = ingredients.map((i) => i.brand_vendor)
    return res.status(200).json(results)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}
