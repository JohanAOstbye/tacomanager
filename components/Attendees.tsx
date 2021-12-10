import Link from 'next/link';
import clientPromise from '../lib/mongodb';

const Attendees = ({
  date,
  attendees,
}: {
  date: string;
  attendees: string[];
}) => {
  const d = new Date(date);
  return (
    <div className='py-5 w-full'>
      <p>
        De som skal ha taco kl:{' '}
        <span>
          {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </p>
      <p>
        for å endre tid:{' '}
        <span className=' text-blue-500'>
          <Link href={'/change'}>klikk her</Link>
        </span>
      </p>
      <div className='w-full bg-white rounded-lg shadow'>
        <ul className='divide-y-2 divide-gray-100'>
          {attendees.map((attendee: string, index: number) => (
            <li key={index} className='p-3'>
              {attendee}
            </li>
          ))}
        </ul>
      </div>
      Antall: {attendees.length}
    </div>
  );
};

export default Attendees;
