import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (session) {
    res.status(200).json({ session });
  } else {
    res.status(418).json({ message: 'you are not logged in' });
  }
};
