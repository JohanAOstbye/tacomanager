import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise, { hash, zeroPad } from '../../../lib/mongodb'

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { method } = request
  const client = await clientPromise
  const session = await getSession({ req: request })
  const { date: string_date } = request.body
  const date = new Date(string_date)

  if (method === 'POST') {
    const { tid } = request.body

    try {
      const update = await client.db().collection('tacodays').findOneAndUpdate(
        { tid: tid },
        {
          date: date,
        }
      )
      return response.status(200).json(update)
    } catch (error) {
      return response.status(418).json({ message: 'failed:(' })
    }
  }

  if (method === 'PUT') {
    const numtid = await (
      await client
        .db()
        .collection('dayscount')
        .findOneAndUpdate({ _id: 'tid' }, { $inc: { seq: 1 } })
    ).value

    const returnTid = hash.encode(zeroPad(numtid.seq))

    try {
      await client
        .db()
        .collection('tacodays')
        .insertOne({
          tid: returnTid,
          date: date,
          attendees: [session.user],
          creator: session.user.displayname,
        })
      return response.status(201).json({ message: 'success', tid: returnTid })
    } catch (error) {
      return response.status(418).json({ message: 'failed:(' })
    }
  }
}
