import axios from 'axios';
import React from 'react';
import Attendees from '../../components/Attendees';
import clientPromise from '../../lib/mongodb';
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

export async function getServerSideProps() {
  const client = await clientPromise;
  const tacoday = await client.db();

  return {
    props: {
      tacoday: tacoday,
    },
  };
}
