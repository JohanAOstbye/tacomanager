import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { baseURL } from '../lib/api';

const NameJoin = (props: {
  attendees: string[];
  refresh: () => Promise<void>;
}) => {
  const [name, setName] = useState('');
  const router = useRouter();

  const regex = RegExp('^[A-Za-z0-9._()!*@,+-]*$');

  const update = (add = false) => {
    if (regex.test(name)) {
      console.log('fuck u');
    }
    let attendees = props.attendees;
    console.log();

    if (add) {
      attendees.push(name);
    } else {
      attendees = attendees.filter((person) => {
        return person != name;
      });
    }
    axios.post('/api/tacoday/person', { attendees }).then((response) => {
      if (response.status == 200) {
        props.refresh();
      }
    });
  };

  return (
    <div className='w-full max-w-sm'>
      <div className='flex items-center border-b border-blue-500 py-2 mb-3'>
        <input
          className='appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none'
          type='text'
          placeholder='Jigg Jiggerson'
          aria-label='Full name'
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <button
          className='hidden sm:block flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded'
          type='button'
          onClick={() => {
            update(true);
          }}
        >
          Join taco:)
        </button>
        <button
          className='hidden sm:block flex-shrink-0 border-transparent border-4 text-blue-500 hover:text-blue-800 text-sm py-1 px-2 rounded'
          type='button'
          onClick={() => {
            update(false);
          }}
        >
          yeet me:(
        </button>
      </div>
      <button
        className='sm:hidden flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded'
        type='button'
        onClick={() => {
          update(true);
        }}
      >
        Join taco:)
      </button>
      <button
        className='sm:hidden flex-shrink-0 border-transparent border-4 text-blue-500 hover:text-blue-800 text-sm py-1 px-2 rounded'
        type='button'
        onClick={() => {
          update(false);
        }}
      >
        yeet me:(
      </button>
    </div>
  );
};

export default NameJoin;
