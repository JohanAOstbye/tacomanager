import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/layout';
import TimePicker from '../components/TimePicker';
import { baseURL } from '../lib/api';
import { tacoday } from '../lib/types';
import { useRouter } from 'next/router';

export default function Change() {
  const [tacotime, setTacotime] = useState<{
    hours: string;
    minutes: string;
  }>({
    hours: '',
    minutes: '',
  });
  const router = useRouter();

  useEffect(() => {
    axios.get<tacoday>('api/tacoday').then((response) => {
      if (response.status == 200) {
        const { date } = response.data;
        const d = new Date(date);
        const time = d
          .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          .split(':');
        setTacotime({ hours: time[0], minutes: time[1] });
      }
    });
  }, []);

  const change = () => {
    const { minutes } = tacotime;
    const d = new Date();
    const temp_hour = parseInt(tacotime.hours) + d.getTimezoneOffset() / 60;
    const hours = temp_hour.toString();

    axios
      .post(baseURL(window.location) + '/api/tacoday', { hours, minutes })
      .then((response) => {
        if (response.status == 200) {
          router.push('/');
        }
      });
  };

  return (
    <Layout>
      <div>
        <div className='flex flex-col items-center'>
          <h1 className='text-5xl'>Changing taco with da BOIIIS</h1>
          <span>Når skal tacoen være?</span>
          <TimePicker tacotime={tacotime} set={setTacotime} />
          <button
            className='m-5 flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded'
            type='button'
            onClick={change}
          >
            Change taco time:)
          </button>
        </div>
        <svg></svg>
      </div>
    </Layout>
  );
}
