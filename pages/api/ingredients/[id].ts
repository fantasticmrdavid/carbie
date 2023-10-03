// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/app/lib/prisma'
import { getSession } from 'next-auth/react'

export const getIngredientSingle = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  try {
    const session = await getSession({ req })
    if (!session) return res.status(401)
    const { user } = session
    if (!user) return res.status(401)

    const {
      query: { id },
    } = req

    const results = await prisma.ingredient.findUnique({
      where: {
        id: id as string,
        users: {
          some: {
            email: {
              in: [process.env.PUBLIC_ACCOUNT_EMAIL as string],
            },
          },
        },
      },
    })
    return res.status(200).json(results)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await getIngredientSingle(req, res)
}
