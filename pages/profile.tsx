import { getSession, signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/dist/server/api-utils';
import React from 'react';
import { Button } from '../components/elements/Button';
import Layout from '../components/layout';
import Router from 'next/router';
import FullLoader from '../components/sections/FullLoader';
import axios from 'axios';
import clientPromise from '../lib/mongodb';
import tacodays from './api/tacodays';
import { tacoday } from '../types/types';

const profile = (props: {
  tacodays: [{ tid: string; date: Date; creator: string }];
}) => {
  const { data: session, status } = useSession();
  if (status == 'loading') {
    return (
      <Layout>
        <FullLoader />
      </Layout>
    );
  }
  if (status == 'unauthenticated') {
    Router.push('api/auth/signin');
  }

  const reloadSession = () => {
    const event = new Event('visibilitychange');
    document.dispatchEvent(event);
  };

  return (
    <Layout>
      <section className=' max-w-lg w-full bg-gray-100 flex flex-col items-start p-5 rounded-lg'>
        <div className='flex w-full justify-between'>
          <div className=''>
            <h1 className='w-full text-xl md:text-2xl font-bold mb-1.5'>
              Hei
              {session && session.user && session.user.name
                ? `, ${session.user.name}`
                : ''}
            </h1>
            <p className='text-sm'>diggg er kult</p>
          </div>
          <img src={session.user.image} className='rounded-xl w-20 h-20'></img>
        </div>
        {tacodays.length != 0 ? (
          <div>
            <p>Dine kommende tacodager:</p>
            {}
          </div>
        ) : (
          ''
        )}
        <div className='flex justify-between w-full my-5'>
          <Button
            onClick={() => {
              axios.put('/api/profile/set-image').then(() => reloadSession());
            }}
          >
            Endre butt
          </Button>
          <Button onClick={() => signOut()}>Log ut</Button>
        </div>
      </section>
    </Layout>
  );
};

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const client = await clientPromise;

  let tacodays = await client
    .db()
    .collection<tacoday>('tacodays')
    .find({ attendees: { $elemMatch: { id: session.user.id } } })
    .toArray();

  tacodays.map((tacoday) => {
    tacoday.tid, tacoday.date, tacoday.creator;
  });

  return {
    props: {
      tacodays: JSON.stringify(tacodays),
    },
  };
}

export default profile;
