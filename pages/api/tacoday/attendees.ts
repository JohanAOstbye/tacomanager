import { ObjectID } from 'bson';
import { MongoClient, ReturnDocument } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise, { hash, zeroPad } from '../../../lib/mongodb';
import { displayuser, tacoday } from '../../../lib/types';

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { method } = request;
  const client = await clientPromise;

  const { tid, user, id }: { tid: string; user?: displayuser; id?: string } =
    request.body;

  let data = { message: 'yeet skibbideet' };

  if (method === 'POST') {
    if (!tid || !id) {
      return response
        .status(418)
        .json({ message: 'tid and id (user id) is required' });
    }
    try {
      const newTacoday = await client
        .db()
        .collection<tacoday>('tacodays')
        .findOneAndUpdate(
          { tid: tid },
          {
            $pull: {
              attendees: {
                id: id,
              },
            },
          },
          { returnDocument: 'after' }
        );
      return response.status(200).json(newTacoday);
    } catch (error) {
      return response.status(418).json(data);
    }
  }

  if (method === 'PUT') {
    if (!tid || !user) {
      response.status(418).json({
        message:
          'tid and a user in the format { username: string; id: string; image: undefined | string; joined?: Date; joined_string: string;} is required',
      });
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
        );
      return response.status(200).json(newTacoday);
    } catch (error) {
      return response.status(418).json(data);
    }
  }
};
