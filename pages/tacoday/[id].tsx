import axios from 'axios';
import { getSession, signIn, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { FaCalendarDay, FaClock } from 'react-icons/fa';
import { Button, ButtonLink } from '../../components/elements/Button';
import Loading from '../../components/elements/Loading';
import Layout from '../../components/layout';
import NoTacoday from '../../components/sections/NoTacoday';
import clientPromise from '../../lib/mongodb';
import { displayuser, tacoday } from '../../lib/types';

const Tacoday = (props: { tacoday }) => {
  const [tacoday, setTacoday] = useState<tacoday>({
    date: new Date(props.tacoday.date_string),
    ...props.tacoday,
  });
  const [processing, setProcessing] = useState(false);
  const { data: session, status } = useSession();

  const attending =
    session &&
    tacoday.attendees.some((attendee) => attendee.id == session.user.id);

  if (!tacoday.date_string) {
    return <NoTacoday tid={tacoday.tid} />;
  }

  const join = async () => {
    const username = session.user.name ? session.user.name : session.user.email;
    const id = session.user.id;
    const now = new Date(Date.now());
    const user = {
      username,
      id,
      image: session.user.image
        ? session.user.image
        : `https://eu.ui-avatars.com/api/?name=${username}`,
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
      date_string: response.data.date,
      date: new Date(response.data.date),
      ...response.data,
    });
    console.log(tacoday);

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
      date_string: response.data.date,
      date: new Date(response.data.date),
      ...response.data,
    });
    console.log(tacoday);

    setProcessing(false);
  };
  return (
    <Layout>
      <section className=' max-w-lg w-full bg-gray-100 flex flex-col items-start p-5 rounded-lg'>
        <div className='flex items-center justify-between w-full'>
          <div className=' truncate'>
            <h1 className='w-full text-2xl md:text-3xl text-left font-bold'>
              Taco på {tacoday.date.toLocaleString('no', { weekday: 'long' })}
            </h1>
            <div id='clock' className='flex items-center truncate'>
              <FaClock className='mr-2' />
              {tacoday.date.toLocaleString('no', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
              })}
              <FaCalendarDay className='ml-5 mr-2' />
              <span className='hidden xs:block truncate'>
                {tacoday.date.toLocaleString('no', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className='xs:hidden truncate'>
                {tacoday.date.toLocaleString('no', {
                  month: 'long',
                  day: 'numeric',
                })}
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
              <li className='flex justify-between w-full' key={attendee.id}>
                <div className='flex'>
                  <img
                    src={attendee.image}
                    className='w-6 h-6 rounded-full mr-1.5'
                  />
                  {attendee.username}
                </div>
                <div className='block sm:hidden opacity-50 truncate '>
                  {attendee.joined
                    .toLocaleString('no', {
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                    .replace(',', '')}
                </div>
                <div className='hidden sm:block opacity-50 overflow-hidden'>
                  Joined:{' '}
                  {attendee.joined.toLocaleString('no', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
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
  const { params } = ctx;
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

  if (params.join) {
    const session = await getSession(ctx);

    const username = session.user.name ? session.user.name : session.user.email;
    const id = session.user.id;
    const now = new Date(Date.now());
    const user: displayuser = {
      username,
      id,
      image: session.user.image
        ? session.user.image
        : `https://eu.ui-avatars.com/api/?name=${username}`,
      joined: now,
      joined_string: now.toISOString(),
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

  tacoday.date_string = tacoday.date.toISOString();
  delete tacoday.date;
  tacoday._id = tacoday._id.toString();
  delete tacoday._id;

  console.log(tacoday);

  return {
    props: {
      tacoday: tacoday,
    },
  };
}
