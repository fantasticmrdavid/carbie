// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/app/lib/prisma'
import { getToken } from 'next-auth/jwt'

export const validate = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = await getToken({ req })
    if (!token) return res.status(401)
    const { sub } = token
    if (!sub) return res.status(401)
    const { name, brand } = req.body

    const results = await prisma.ingredient.findFirst({
      where: {
        AND: [
          { name },
          {
            brand_vendor: brand,
          },
          {
            users: {
              some: {
                id: sub,
              },
            },
          },
        ],
      },
    })
    return res.status(200).json({ isValid: !results })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case 'POST':
      return await validate(req, res)
  }
}
