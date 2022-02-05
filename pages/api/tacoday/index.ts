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
        .db()
        .collection('tacodays')
        .aggregate([
          {
            $match: {
              date: { $gte: today, $lt: tomorrow },
            },
          },
          {
            $sort: {
              date: -1,
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
  console.log(date);
  const hour = parseInt(hours);
  const minute = parseInt(minutes);
  console.log({ hour, minute });

  date.setHours(hour, minute);
  console.log(date);

  if (method === 'POST') {
    try {
      const update = await client
        .db()
        .collection('tacodays')
        .insertOne({
          tid: returnTid,
          date: date,
          attendees: [user],
          creator: user.displayname,
        });
      return response.status(201).json({ message: 'success', tid: returnTid });
    } catch (error) {
      console.log(error);
      return response.status(418).json(data);
    }
  }
};
