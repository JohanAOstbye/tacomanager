import { ObjectID } from 'bson';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import clientPromise from '../../../lib/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { displayname } = req.body;

  const session = await getSession({ req });
  if (session) {
    if (req.method == 'POST') {
      if (displayname == null) {
        res.status(418).json({ message: 'no updatevalue specified' });
      }
      const client = await clientPromise;

      const user = await client
        .db()
        .collection('users')
        .findOneAndUpdate(
          { _id: new ObjectID(session.user.id) },
          { $set: { displayname: displayname } },
          { returnDocument: 'after' }
        );
      console.log(user);

      res.status(200).json({ user });
    } else {
      res.status(418).json({ message: 'This only accepts post methods' });
    }
  } else {
    res.status(418).json({ message: 'you are not logged in' });
  }
};
