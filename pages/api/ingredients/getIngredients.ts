// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/app/lib/prisma'
import { getSession } from 'next-auth/react'

export const getIngredients = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  try {
    const session = await getSession({ req })
    if (!session) return res.status(401)
    const { user } = session
    if (!user) return res.status(401)

    const {
      query: { q },
    } = req

    const results = await prisma.ingredient.findMany({
      where: {
        name: {
          contains: q as string,
        },
        users: {
          some: {
            email: {
              in: [process.env.PUBLIC_ACCOUNT_EMAIL as string],
            },
          },
        },
      },
      orderBy: [{ name: 'asc' }],
    })
    return res.status(200).json(results)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}
