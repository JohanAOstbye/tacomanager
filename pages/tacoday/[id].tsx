import axios from 'axios';
import { getSession, signIn, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { FaCalendarDay, FaClock } from 'react-icons/fa';
import { Button, ButtonLink } from '../../components/elements/Button';
import Loading from '../../components/elements/Loading';
import Layout from '../../components/layout';
import NoTacoday from '../../components/sections/NoTacoday';
import { date } from '../../lib/formatting';
import clientPromise from '../../lib/mongodb';
import { displayuser, tacoday } from '../../types/types';

const Tacoday = (props: { tacoday }) => {
  const [tacoday, setTacoday] = useState<tacoday>({
    ...JSON.parse(props.tacoday),
    date: new Date(JSON.parse(props.tacoday)['date']),
  });

  const [processing, setProcessing] = useState(false);
  const { data: session, status } = useSession();

  const attending =
    session &&
    tacoday.attendees.some((attendee) => attendee.id == session.user.id);

  const join = async () => {
    const username = session.user.displayname;
    const id = session.user.id;
    const now = new Date(Date.now());
    const user = {
      username,
      id,
      image: session.user.image,
      joined: now,
    };

    setProcessing(true);
    const data = {
      tid: tacoday.tid,
      user: user,
      id: null,
    };
    const response = await axios.put('/api/tacoday/attendees', data);
    setTacoday({
      date: new Date(response.data.date),
      ...response.data,
    });

    setProcessing(false);
  };
  const leave = async () => {
    const id = session.user.id;

    setProcessing(true);
    const data = {
      tid: tacoday.tid,
      user: null,
      id: id,
    };
    const response = await axios.post('/api/tacoday/attendees', data);
    setTacoday({
      date: new Date(response.data.date),
      ...response.data,
    });

    setProcessing(false);
  };
  return (
    <Layout>
      <section className=' max-w-lg w-full bg-gray-100 flex flex-col items-start p-5 rounded-lg'>
        <div className='flex items-center justify-between w-full'>
          <div className=' truncate'>
            <h1 className='w-full text-2xl md:text-3xl text-left font-bold'>
              Taco på {date.day(tacoday.date)}
            </h1>
            <div id='clock' className='flex items-center truncate'>
              <FaClock className='mr-2' />
              {date.time(tacoday.date)}
              <FaCalendarDay className='ml-5 mr-2' />
              <span className='hidden xs:block truncate'>
                {date.long(tacoday.date)}
              </span>
              <span className='xs:hidden truncate'>
                {date.medium(tacoday.date)}
              </span>
            </div>
            <p className='w-full text-left'>
              Antall påmeldte: {tacoday.attendees.length}
            </p>
          </div>
          <div className='flex flex-col min-w-max'>
            <Button
              primary
              onClick={() => {
                if (status == 'authenticated') {
                  if (attending) {
                    leave();
                  } else {
                    join();
                  }
                } else {
                  signIn(null, {
                    callbackUrl: `/tacoday/${tacoday.tid}?join=true`,
                  });
                }
              }}
              classNames='my-1 flex justify-center'
            >
              {processing ? (
                <Loading white />
              ) : attending ? (
                'Yeet meg:('
              ) : (
                'Bli med'
              )}
            </Button>
            {status == 'authenticated' ? (
              <ButtonLink
                primary={false}
                link={`/tacoday/change/`}
                classNames='bg-zinc-200'
              >
                Endre
              </ButtonLink>
            ) : (
              ''
            )}
          </div>
        </div>

        <ul className='my-4 flex flex-col items-center justify-center w-full'>
          {tacoday.attendees.map((attendee: displayuser) => {
            attendee.joined = new Date(attendee.joined);

            return (
              <li
                className='flex justify-between items-center w-full my-1.5'
                key={attendee.id}
              >
                <div className='flex items-center'>
                  <img
                    src={attendee.image}
                    className='w-8 h-8 rounded-full mr-1.5'
                  />
                  {attendee.username}
                </div>
                <div className='block sm:hidden opacity-50 truncate '>
                  {date.short_wtime(attendee.joined)}
                </div>
                <div className='hidden sm:block opacity-50 overflow-hidden'>
                  Joined: {date.medium_wtime(attendee.joined)}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </Layout>
  );
};

export default Tacoday;

export async function getServerSideProps(ctx) {
  const { params, query } = ctx;
  const client = await clientPromise;
  const tacoday = await client
    .db()
    .collection<tacoday>('tacodays')
    .findOne({ tid: params.id });

  if (!tacoday) {
    return {
      props: {
        tacoday: {
          date_string: null,
          date: null,
          attendees: null,
          tid: params.id,
        },
      },
    };
  }

  const session = await getSession(ctx);

  if (query.join && tacoday.attendees.some((e) => e.id == session.user.id)) {
    const username = session.user.displayname;
    const id = session.user.id;
    const now = new Date(Date.now());
    const user: displayuser = {
      username,
      id,
      image: session.user.image,
      joined: now,
    };
    client
      .db()
      .collection<tacoday>('tacodays')
      .findOneAndUpdate(
        { tid: params.id },
        {
          $push: {
            attendees: user,
          },
        }
      );
    tacoday.attendees = (
      await client
        .db()
        .collection<tacoday>('tacodays')
        .findOne({ tid: params.id })
    ).attendees;
  }

  return {
    props: {
      tacoday: JSON.stringify(tacoday),
    },
  };
}
