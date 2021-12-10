import { useState, useEffect } from 'react';
import Image from 'next/image';
import Layout from '../components/layout';
import NameJoin from '../components/NameJoin';
import Attendees from '../components/Attendees';
import taco from '../public/images/taco.svg';
import axios, { AxiosResponse } from 'axios';
import { tacoday } from '../lib/types';
import Link from 'next/link';

export default function Home() {
  const [loading, setloading] = useState(true);
  const [tacoday, settacoday] = useState<tacoday>({ date: '', attendees: [] });
  const getTacoday = async () => {
    setloading(true);
    await axios.get('api/tacoday').then((tday: AxiosResponse<tacoday>) => {
      settacoday(tday.data);
      setloading(false);
    });
  };
  useEffect(() => {
    getTacoday();
  }, []);
  return (
    <Layout>
      <div className='flex flex-col-reverse lg:flex-row'>
        <div className='flex flex-col items-center '>
          <h1 className='text-5xl'>Taco with da BOIIIS</h1>
          <p>Super side for all som skal ha taco</p>
          <NameJoin attendees={tacoday.attendees} refresh={getTacoday} />
          {loading ? (
            <div>loading</div>
          ) : tacoday.date != null ? (
            <Attendees date={tacoday.date} attendees={tacoday.attendees} />
          ) : (
            <div>
              <p>F, no tacoday planned:'(</p>
              <div className='bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded'>
                <Link href={'/new'}>Insj på taco!</Link>
              </div>
            </div>
          )}
          <div></div>
        </div>
        <div className='text-black flex justify-center items-center h-80 w-80 relative mx-10'>
          <Image src={taco} layout='fill' objectFit='contain' />
        </div>
      </div>
    </Layout>
  );
}
