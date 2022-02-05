import React from 'react';
import { FaCalendarDay, FaClock } from 'react-icons/fa';
import { ButtonLink } from '../../../components/elements/Button';
import Layout from '../../../components/layout';
import clientPromise from '../../../lib/mongodb';
import { displayuser, tacoday } from '../../../types/types';

const ChangeTacoday = ({ tacoday }: { tacoday: tacoday }) => {
  const { date_string, attendees, tid } = tacoday;

  const date = new Date(date_string);
  return (
    <Layout>
      <section className=' max-w-lg w-full bg-gray-100 flex flex-col items-start p-5 rounded-lg'>
        <div>
          <div>
            <h1 className='w-full text-2xl text-left font-bold'>
              Taco på {date.toLocaleString('no', { weekday: 'long' })}
            </h1>
            <div id='clock' className='flex items-center'>
              <FaClock className='mr-2' />
              {date.toLocaleString('no', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
              })}
              <FaCalendarDay className='ml-5 mr-2' />
              {date.toLocaleString('no', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
          <ButtonLink link={`/tacoday/change/`}>Endre</ButtonLink>
        </div>
        <p></p>
        <div>
          {attendees.map((attendee: displayuser) => (
            <p>{attendee.username}</p>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default ChangeTacoday;

export async function getServerSideProps({ params }) {
  const client = await clientPromise;
  const tacoday = await client
    .db()
    .collection('tacodays')
    .findOne({ tid: params.id });

  if (!tacoday) {
    return {
      props: { tacoday: { date: null, attendees: null, tid: params.id } },
    };
  }

  tacoday.date_string = tacoday.date.toString();
  delete tacoday.date;
  tacoday.id = tacoday._id.toString();
  delete tacoday._id;

  return {
    props: {
      tacoday: tacoday,
    },
  };
}
