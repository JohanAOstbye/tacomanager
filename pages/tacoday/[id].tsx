import axios from 'axios';
import { getSession, signIn, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { FaCalendarDay, FaClock } from 'react-icons/fa';
import { Button, ButtonLink } from '../../components/elements/Button';
import Loading from '../../components/elements/Loading';
import Layout from '../../components/layout';
import NoTacoday from '../../components/sections/NoTacoday';
import clientPromise from '../../lib/mongodb';
import { displayuser, tacoday } from '../../types/types';

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
