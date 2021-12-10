import { ObjectID } from 'bson';
import { MongoClient } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { method } = request;
  const client = await clientPromise;

  const date = new Date();
  date.setHours(1, 0, 0, 0);

  const today = new Date(date);
  const tomorrow = new Date(date);
  tomorrow.setDate(date.getDate() + 1);

  let data = { message: 'yeet skibbideet', date: null, attendees: [] };

  if (method === 'GET') {
    try {
      const result = await client
        .db(process.env.MONGODB_DB)
        .collection('tacodays')
        .aggregate([
          {
            $match: {
              date: { $gte: today, $lt: tomorrow },
            },
          },
          {
            $sort: {
              date: 1,
            },
          },
          {
            $limit: 1,
          },
        ])
        .toArray();
      if (result.length == 0) {
        return response.status(204).json('');
      } else {
        return response.status(200).json({ ...result[0], message: 'yess' });
      }
    } catch (error) {
      return response.status(418).json(data);
    }
  }

  const {
    body: { hours, minutes },
  } = request;
  if (Array.isArray(hours) || Array.isArray(minutes)) {
    return response
      .status(400)
      .json({ message: 'hours and minutes cant be arrays' });
  }
  date.setHours(parseInt(hours), parseInt(minutes));

  if (method === 'POST') {
    try {
      const update = await client
        .db(process.env.NEXT_PUBLIC_MONGODB_DB)
        .collection('tacodays')
        .updateOne(
          { date: { $gte: today, $lt: tomorrow } },
          { $set: { date: date } }
        );
      return response.status(200).json(update);
    } catch (error) {
      return response.status(418).json(data);
    }
  }

  if (method === 'PUT') {
    const {
      body: { name },
    } = request;
    const tacoday = { date: date, attendees: [name] };

    try {
      const put = await client
        .db(process.env.NEXT_PUBLIC_MONGODB_DB)
        .collection('tacodays')
        .insertOne(tacoday);
      return response.status(201).json({ message: 'success', ...put });
    } catch (error) {
      console.log(error);
      return response.status(418).json(data);
    }
  }
};
