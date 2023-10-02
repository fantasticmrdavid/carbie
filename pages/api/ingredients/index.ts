// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { addIngredient } from './addIngredient'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    // case 'GET':
    //   return await getIngredients(req, res)
    case 'POST':
      return await addIngredient(req, res)
    // case 'PATCH':
    //   return await updateIngredient(req, res)
  }
}
