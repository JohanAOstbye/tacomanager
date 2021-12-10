import type { NextApiRequest, NextApiResponse } from 'next';
import tacoday from '.';
import clientPromise from '../../../lib/mongodb';

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const {
    method,
    body: { attendees },
  } = request;

  const client = await clientPromise;

  const date = new Date();
  date.setHours(1, 0, 0, 0);

  const today = new Date(date);
  const tomorrow = new Date(date);
  tomorrow.setDate(date.getDate() + 1);

  let data = { message: 'yeet skibbideet' };

  if (method === 'POST') {
    try {
      console.log({ date: { $gte: today, $lt: tomorrow } });

      const result = await client
        .db(process.env.MONGODB_DB)
        .collection('tacodays')
        .updateOne(
          { date: { $gte: today, $lt: tomorrow } },
          { $set: { attendees: attendees } }
        );

      return response.status(200).json({ ...result, message: 'yiss bby' });
    } catch (error) {
      console.log(error);

      return response.status(418).json(data);
    }
  }
};
