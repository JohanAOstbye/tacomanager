import { ObjectID } from 'bson';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import clientPromise from '../../../lib/mongodb';

const gifs = [
  'Alien-Butt.gif',
  'Business.gif',
  'CensoredButt.gif',
  'Cow-Butt.gif',
  'Diver-Butt.gif',
  'EasterBunny.gif',
  'EinsteinButt.gif',
  'GlassesButt.gif',
  'HairyButt.gif',
  'Heart-Eyes-Butt.gif',
  'Jeans-Butt.gif',
  'KeynoteButt.gif',
  'Magic-Butt.gif',
  'PabsButt.gif',
  'Romantic-Butt.gif',
  'Samba-butt.gif',
  'Shivering-butt.gif',
  'SmallButt.gif',
  'Superhero-butt.gif',
  'Sweaty-butt.gif',
  'ThunderButt.gif',
  'UX-Designer-Butt.gif',
  'Werewolf-Putt.gif',
  'Zebra-butt.gif',
  'async-butt.gif',
  'bongo-butt.gif',
  'bouncing-butt-II.gif',
  'bouncy-butt.gif',
  'clapping-butt.gif',
  'flaming-butt.gif',
  'flexing-butt.gif',
  'frankenstein-butt.gif',
  'frida-butthlo.gif',
  'inception-butt.gif',
  'infinite-butt.gif',
  'kissing-butt.gif',
  'no-butt.gif',
  'pirate-butt.gif',
  'pointing-butt.gif',
  'seeing-butt.gif',
  'shiny-butt.gif',
  'space-butt.gif',
  'swinging-butt.gif',
  'triple-butt.gif',
  'underwater-butt.gif',
  'vampire-butt.gif',
  'vampire.gif',
];

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  console.log('hei');

  if (session && req.method == 'PUT') {
    const client = await clientPromise;
    var gif = `images/buttsss/${gifs[Math.floor(Math.random() * gifs.length)]}`;
    console.log(gif);

    if (session.user.image) {
      const user = await client
        .db()
        .collection('users')
        .findOneAndUpdate(
          { _id: new ObjectID(session.user.id) },
          { $set: { image: gif } },
          { returnDocument: 'after' }
        );

      res.status(200).json({ user });
    }

    const user = await client
      .db()
      .collection('users')
      .findOneAndUpdate(
        { _id: new ObjectID(session.user.id) },
        { $set: { image: gif } },
        { returnDocument: 'after' }
      );
    res.status(200).json({ user });
  } else {
    res.status(418).json({ message: 'you are not logged in' });
  }
};
