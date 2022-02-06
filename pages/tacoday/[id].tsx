import React from 'react';
import clientPromise, { feistel } from '../../lib/mongodb';
import { displayuser, tacoday } from '../../lib/types';

const Tacoday = (props: { tacoday: tacoday }) => {
  const { tacoday } = props;
  return (
    <div>
      <p>{tacoday.date}</p>
      <div>
        {tacoday.attendees.map((attendee: displayuser) => (
          <p>{attendee.name}</p>
        ))}
      </div>
    </div>
  );
};

export default Tacoday;

export async function getServerSideProps({ params }) {
  const client = await clientPromise;
  const tacoday = await client
    .db()
    .collection('tacodays')
    .findOne({ tid: feistel.decode(params.id) });

  return {
    props: {
      tacoday: tacoday,
    },
  };
}
