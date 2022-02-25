import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise from '../../../lib/mongodb'
import { displayuser, tacoday } from '../../../types/types'

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const session = await getSession({ req: request })

  const { method } = request
  const client = await clientPromise

  const { tid }: { tid: string } = request.body
  if (!tid) {
    return response.status(418).json({ message: 'tid is required' })
  }
  const defaultreturn = { message: 'yeet skibbideet' }

  if (method === 'POST') {
    try {
      const newTacoday = await client
        .db()
        .collection<tacoday>('tacodays')
        .findOneAndUpdate(
          { tid: tid },
          {
            $pull: {
              attendees: {
                id: session.user.id,
              },
            },
          },
          { returnDocument: 'after' }
        )

      return response.status(200).json((await newTacoday).value)
    } catch (error) {
      return response.status(418).json(defaultreturn)
    }
  }

  if (method === 'PUT') {
    const user: displayuser = {
      displayname: session.user.displayname,
      id: session.user.id,
      image: session.user.image,
      joined: new Date(Date.now()),
    }
    try {
      const newTacoday = client
        .db()
        .collection<tacoday>('tacodays')
        .findOneAndUpdate(
          { tid: tid },
          {
            $push: {
              attendees: user,
            },
          },
          { returnDocument: 'after' }
        )

      return response.status(200).json((await newTacoday).value)
    } catch (error) {
      return response.status(418).json(defaultreturn)
    }
  }
}
