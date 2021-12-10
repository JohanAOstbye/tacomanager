import axios from 'axios';
import { Router, useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import NameCreate from '../components/NameCreate';
import TimePicker from '../components/TimePicker';
import { baseURL } from '../lib/api';
export default function New() {
  const [tacotime, setTacotime] = useState({
    hours: '23',
    minutes: '00',
    name: '',
  });
  const [name, setname] = useState('');
  const router = useRouter();

  useEffect(() => {
    axios.get('api/tacoday').then((response) => {
      console.log(response);
      if (response.status == 200) {
        router.push('/');
      }
    });
  }, []);

  const create = () => {
    axios
      .put(baseURL(window.location) + '/api/tacoday', { ...tacotime, name })
      .then((response) => {
        if (response.status == 201) {
          router.push('/');
        }
      });
  };
  return (
    <Layout>
      <div>
        <div className='flex flex-col items-center'>
          <h1 className='text-5xl'>New taco with da BOIIIS</h1>
          <div className='flex items-center justify-between'>
            <span className='mx-3'>Når skal tacoen være?</span>
            <TimePicker tacotime={tacotime} set={setTacotime} />
          </div>
          <NameCreate create={create} name={name} set={setname} />
        </div>
      </div>
    </Layout>
  );
}
